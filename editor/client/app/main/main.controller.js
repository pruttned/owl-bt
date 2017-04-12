'use strict';

angular.module('editorApp')
  .controller('MainCtrl', function ($location) {
    this.openTree = function (treePath) {
      $location.path('/tree').search({
        path: treePath
      });
    }
  });
