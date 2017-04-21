'use strict';

(function() {

  class TreeViewModelProvider {

    create(rootNode) {
      return this._toViewTree(rootNode);
    }

    getAllNodes(rootViewNode) {
      let outViewNodes = [];
      this._getAllNodes(rootViewNode, outViewNodes);
      return outViewNodes;
    }

    _getAllNodes(rootViewNode, outViewNodes) {
      outViewNodes.push(rootViewNode);
      if (rootViewNode.children) {
        for (let childNode of rootViewNode.children) {
          this._getAllNodes(childNode, outViewNodes);
        }
      }
    }

    _initNodeMapper() {
      //transform to static with this in closures
      if (!this.nodeMapper) {
        this.nodeMapper = n => this._toViewTree(n);
      }
    }

    _toViewTree(node) {
      this._initNodeMapper();

      let viewNode = {
        nodeItem: node,
        id: node.$meta.id,
        version: node.$meta.version,
        desc: node.$meta.desc,
      };
      if (node.services) {
        viewNode.services = node.services.map(service => ({
          nodeItem: service,
          desc: service.$meta.desc,
          viewNode: viewNode,
        }));
      }
      if (node.decorators) {
        viewNode.decorators = node.decorators.map(decorator => ({
          nodeItem: decorator,
          desc: decorator.$meta.desc,
          viewNode: viewNode,
        }));
      }
      if (node.childNodes) {
        viewNode.children = node.childNodes.map(this.nodeMapper);
      }
      return viewNode;
    }
  }

  angular.module('editorApp')
    .service('TreeViewModelProvider', TreeViewModelProvider);
})();
