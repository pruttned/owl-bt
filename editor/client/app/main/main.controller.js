'use strict';

angular.module('editorApp')
  .controller('MainCtrl', function ($location, $httpParamSerializer, TreeMruList) {
    this.treeMruItems = TreeMruList.getList().map(item => ({
      url: '/tree?' + $httpParamSerializer({ path: item.path }),
      name: item.path
    }));
    this.openTree = function (treePath) {
      $location.path('/tree').search({
        path: treePath
      });
    }
  });
