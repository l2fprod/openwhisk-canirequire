var catalogApp = angular.module('catalogApp', [ ]);

catalogApp.controller('MainController', function ($scope, $http) {
  console.info("Initializing MainController");
  $scope.links = [];

  $http.get("/api/1/modules").success(function(result) {
    $scope.version = result.node_version;
    $scope.modules = result.modules;
  });
});
