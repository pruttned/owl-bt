'use strict';

angular.module('editorApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/project?dirPath', {
        templateUrl: 'app/project/project.html',
        controller: 'ProjectCtrl'
      });
  });
