'use strict';

(function() {

  /**
   * Common node functions
   */
  class Node {

    updateVersion(node) {
      if (node.$meta.version === Number.MAX_SAFE_INTEGER) {
        node.$meta.version = 1;
      } else {
        node.$meta.version++;
      }
    }

  }

  angular.module('editorApp')
    .service('Node', Node);
})();
