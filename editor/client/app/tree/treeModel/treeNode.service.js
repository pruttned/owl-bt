'use strict';

(function() {

  /**
   * Common node functions
   */
  class TreeNode {

    updateVersion(node) {
      if (node.$meta.version === Number.MAX_SAFE_INTEGER) {
        node.$meta.version = 1;
      } else {
        node.$meta.version++;
      }
    }

    addService(node, service) {
      if(service.$meta.node){
        throw new Error('Service is already in a node');
      }
      if(!node.services){
        node.services = [];
      }
      node.services.push(service);
      service.$meta.node = node;
    }

    addDecorator(node, decorator) {
      if(decorator.$meta.node){
        throw new Error('Decorator is already in a node');
      }
      if(!node.decorators){
        node.decorators = [];
      }
      node.decorators.push(decorator);
      decorator.$meta.node = node;
    }

    addChildNode(node, childNode) {
      if(childNode.$meta.parentNode){
        throw new Error('Node is already child of a node');
      }
      if(!node.childNodes){
        node.childNodes = [];
      }
      node.childNodes.push(childNode);
      childNode.$meta.parentNode = node;
    }
  }

  angular.module('editorApp')
    .service('TreeNode', TreeNode);
})();
