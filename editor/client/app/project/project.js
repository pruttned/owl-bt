'use strict';

angular.module('editorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('project', {
        url: '/project?dirPath',
        templateUrl: 'app/project/project.html',
        controller: 'ProjectCtrl'
      });
  });
