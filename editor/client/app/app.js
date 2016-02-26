'use strict';

angular.module('editorApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'cfp.hotkeys'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  })
  .constant('_', window._) //http://stackoverflow.com/a/23984685
  .constant('d3', window.d3)
  .constant('undoStackSize', 100)
  ;
