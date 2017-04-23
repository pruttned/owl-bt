'use strict';

angular.module('editorApp')
  .controller('MainCtrl', function ($location, $httpParamSerializer) {
    this.openTree = function (treePath) {
      $location.path('/tree').search({
        path: treePath
      });
    }
  });
