'use strict';

angular.module('editorApp')
  .controller('MainCtrl', function($scope, $http, $resource, $state, ProjectStore) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.myTest = {};

    $scope.callSrv = function() {
      var MyTestResource = $resource('/api/myTest/:id');

      $scope.myTest = MyTestResource.get({
        id: 22
      }, function(data) {
        console.log(data);
      });

    };

    $scope.projects = ProjectStore.projects;

    $scope.addProject = function(path) {
      ProjectStore.addProject({
        path: path
      });
    };

  });
