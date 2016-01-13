'use strict';

(function () {
  let ProjectItemType = {
    DIRECTORY: 0,
    TREE: 1
  };

  if (typeof(window) !== 'undefined') { //client
    angular.module('editorApp').constant('ProjectItemType', ProjectItemType);
  } else { //server
    exports.ProjectItemType = ProjectItemType;
  }
})();
