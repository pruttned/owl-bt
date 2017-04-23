'use strict';

angular.module('editorApp')
  .controller('MainCtrl', function ($location, $httpParamSerializer) {
    this.openTree = function (treePath) {
      if (treePath) {
        $location.path('/tree').search({
          path: treePath
        });
      }
    }
  });
