'use strict';

angular.module('editorApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'cfp.hotkeys',
  'ngScrollbars'
])
  .config(function ($routeProvider, $locationProvider, ScrollBarsProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);

    ScrollBarsProvider.defaults = {
      scrollButtons: {
        scrollAmount: 'auto',
        enable: true
      },
      axis: 'y',
      autoHideScrollbar: true,
      theme: 'minimal-dark'
    };
  })
  .constant('_', window._) //http://stackoverflow.com/a/23984685
  .constant('Toposort', window.Toposort) //http://stackoverflow.com/a/23984685
  .constant('d3', window.d3)
  .constant('io', window.io)
  .constant('undoStackSize', 100)
  ;
