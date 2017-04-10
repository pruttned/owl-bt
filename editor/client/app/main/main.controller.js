'use strict';

angular.module('editorApp')
  .controller('MainCtrl', function($scope, $http, $resource, ProjectStore) {

    $scope.projects = ProjectStore.projects;

    $scope.addProject = function(path) {
      ProjectStore.addProject({
        path: path
      });
    };
    $scope.removeProject = function(project) {
      ProjectStore.removeProject(project);
    };

  });
