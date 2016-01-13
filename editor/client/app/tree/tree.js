'use strict';

angular.module('editorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tree', {
        url: '/tree',
        templateUrl: 'app/tree/tree.html',
        controller: 'TreeCtrl'
      });
  });
