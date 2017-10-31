function main() {
  var fs = require('fs');
  var natives = Object.keys(process.binding("natives")).filter(function (nativeDep) {
    return nativeDep[0] !== '_';
  }).map(function (native) {
    return {
      version: 'native',
      name: native
    };
  });

  var result = {
    node_version: process.version,
    modules: natives.concat(fs.readdirSync(__dirname + '/node_modules')
      .filter(function (dir) {
        return dir[0] !== '.';
      })
      .reduce(function (prev, dep) {
        try {
          var depObj = JSON.parse(fs.readFileSync(__dirname + '/node_modules/' + dep + '/package.json'));
          return prev.concat({
            name: depObj.name,
            version: depObj.version,
            homepage: depObj.homepage
          });
        } catch (error) {
          console.log(error);
          return prev;
        }
      }, []))
  }
  return result;
}
