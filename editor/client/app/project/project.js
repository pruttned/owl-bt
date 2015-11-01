'use strict';

angular.module('editorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('project', {
        url: '/project?path',
        templateUrl: 'app/project/project.html',
        controller: 'ProjectCtrl'
      });
  });
