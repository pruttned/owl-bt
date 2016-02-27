'use strict';

angular.module('editorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/tree', {
        templateUrl: 'app/tree/tree.html',
        controller: 'TreeCtrl'
      });
  });
