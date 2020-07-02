'use strict';

angular.module('editorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/tree', {
        template: require('./tree.html'),
        controller: 'TreeCtrl',
        controllerAs: 'tree'
      });
  });
