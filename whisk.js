var request = require('request');

function Whisk(url) {
  var self = this;

  //callback(err, response, body)
  self.createOrUpdateAction = function (actionName, actionCode, callback) {
    console.log("Creating action", actionName);
    request({
      url: url + "/api/v1/namespaces/_/actions/" + actionName + "?overwrite=true",
      method: 'PUT',
      json: {
        "exec": {
          "kind": "nodejs",
          "code": actionCode
        }
      },
      rejectUnauthorized: false
    }, function (err, response, body) {
      if (response && response.statusCode == 409) {
        console.log("Action already exists");
      } else if (response && response.statusCode == 200) {
        console.log("Action successfully created", body);
      } else {
        console.log("Failed to create action", err, body);
      }
      if (callback) callback(err, response, body);
    });
  };

  self.deleteAction = function (actionName, callback) {
    console.log("Deleting action", actionName);
    request({
      url: url + "/api/v1/namespaces/_/actions/" + actionName,
      method: 'DELETE',
      rejectUnauthorized: false
    }, function (err, response, body) {
      callback(err, response, body);
    });
  };

  self.invokeAction = function (actionName, callback) {
    console.log("Invoking action", actionName);
    request.post(url + "/api/v1/namespaces/_/actions/" + actionName + "?blocking=true", {
        rejectUnauthorized: false,
        json: true
      },
      function (err, response, body) {
        if (err) {
          console.log(err);
          callback(err);
        } else if (body && body.response && body.response.result) {
          callback(null, body.response.result);          
        } else {
          callback("no result in response");
        }
      });
  };
}

module.exports = function (url) {
  return new Whisk(url);
}
