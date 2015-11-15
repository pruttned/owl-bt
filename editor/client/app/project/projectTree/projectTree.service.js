'use strict';

angular.module('editorApp')
  .service('ProjectTree', function($resource) {

    this.getProjectItems = function(directoryPath) {
      let resource = $resource('/api/projectTree?dirPath=:dirPath');

      let result = resource.get({
        dirPath: directoryPath
      });

      return result.$promise;
    };
  });
