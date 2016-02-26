'use strict';

angular.module('editorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/tree/:treePath*', {
        templateUrl: 'app/tree/tree.html',
        controller: 'TreeCtrl'
      });
  });
