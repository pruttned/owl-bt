'use strict';

(function() {

  class TreeNodeByIdStore {

    addNode(node) {
      if (node) {
        if (!this.nodesById) {
          this.nodesById = {};
        }
        let existingNode = this.nodesById[node.$meta.id];
        if (existingNode &&  existingNode !== node) {
          throw new Error('Duplicate node id');
        }
        this.nodesById[node.$meta.id] = node;
      }
    }

    removeNode(node){
      if(node && this.nodesById){
        delete this.nodesById[node.$meta.id];
      }
    }

    getNode(nodeId) {
      if (this.nodesById) {
        return this.nodesById[nodeId];
      }
    }

  }

  angular.module('editorApp')
    .service('TreeNodeByIdStore', TreeNodeByIdStore);
})();
