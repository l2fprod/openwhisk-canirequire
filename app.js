var
  express = require('express'),
  app = express(),
  cfenv = require('cfenv'),
  request = require('request'),
  fs = require('fs');
  async = require('async'),
  apicache = require('apicache').options({ debug: true }).middleware;

// load local VCAP configuration
var vcapLocal = null
try {
  vcapLocal = require("./vcap-local.json");
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) {
  console.error(e);
}

// get the app environment from Cloud Foundry, defaulting to local VCAP
var appEnvOpts = vcapLocal ? {
  vcap: vcapLocal
} : {}
var appEnv = cfenv.getAppEnv(appEnvOpts);

var whiskCreds = appEnv.getServiceCreds("whisk");
var whisk = require("./whisk.js")(whiskCreds.url);

// delete and re-create the action / quick'n dirty way to update it for now
whisk.createOrUpdateAction("list_modules", fs.readFileSync("actions/list_modules.js", "utf8"));

app.get("/api/1/modules", apicache('1 day'), function (req, res, next) {
  console.log("Retrieving module list...");
  whisk.invokeAction("list_modules", function (err, body) {
    if (err) {
      res.status(501).send({
        error: err
      });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    }
  });
});

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// start server on the specified port and binding host
app.listen(appEnv.port, "0.0.0.0", function () {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
