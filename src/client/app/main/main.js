'use strict';

angular.module('editorApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        template: require('./main.html'),
        controller: 'MainCtrl',
        controllerAs: 'main'
      });
  });
