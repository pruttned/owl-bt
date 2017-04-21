'use strict';

(function() {

  /**
   * Common tree functions
   */
  class Tree {
    /**
     * executes given callback on each node
     * @param  {node}   rootNode
     * @param  {Function} callback - fun(node)
     */
    forEachNode(rootNode, callback){
      callback(rootNode);
      if (rootNode.childNodes) {
        for (let i = 0; i < rootNode.childNodes.length; i++) {
          this.forEachNode(rootNode.childNodes[i], callback);
        }
      }
    }
  }

  angular.module('editorApp')
    .service('Tree', Tree);
})();
