'use strict';

(function() {

  /**
   * Common node functions
   */
  class TreeNode {

    constructor(_) {
      this._ = _;
    }

    updateVersion(node) {
      if (node.$meta.version === Number.MAX_SAFE_INTEGER) {
        node.$meta.version = 1;
      } else {
        node.$meta.version++;
      }
    }

    addService(node, service) {
      if (!node.services) {
        node.services = [];
      }
      node.services.push(service);
    }

    addDecorator(node, decorator) {
      if (!node.decorators) {
        node.decorators = [];
      }
      node.decorators.push(decorator);
    }

    addChildNode(node, childNode) {
      if (!node.childNodes) {
        node.childNodes = [];
      }
      node.childNodes.push(childNode);
    }

    indexOfService(node, service) {
      if (node.services) {
        return this._.indexOf(node.services, service);
      }
      return -1;
    }

    indexOfDecorator(node, decorator) {
      if (node.decorators) {
        return this._.indexOf(node.decorators, decorator);
      }
      return -1;
    }
  }

  angular.module('editorApp')
    .service('TreeNode', TreeNode);
})();
