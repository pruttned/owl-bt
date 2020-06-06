import _ from 'lodash';
import Toposort from 'toposort-class';
import d3 from 'd3';
import io from 'socket.io-client';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
import './app.scss'

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
  .constant('undoStackSize', 100)
  //TODO: change to imports in files
  .constant('_', _)
  .constant('Toposort', Toposort)
  .constant('d3', d3)
  .constant('io', io)
  ;
