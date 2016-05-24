'use strict';

(function() {

  class TreeViewModelProvider {

    constructor(NodeItemAction) {
      this._NodeItemAction = NodeItemAction;
    }

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

    _initContextMenuActionProviders() {
      //transform to static with this in closures
      if (!this.getNodeContexMenuActions) {
        this.getNodeContexMenuActions = (node) => this._NodeItemAction.getNodeContexMenuActions(node);
      }
      if (!this.getServiceContexMenuActions) {
        this.getServiceContexMenuActions = (service) => this._NodeItemAction.getServiceContexMenuActions(service);
      }
      if (!this.getDecoratorContexMenuActions) {
        this.getDecoratorContexMenuActions = (decorator) => this._NodeItemAction.getDecoratorContexMenuActions(decorator);
      }
    }

    _toViewTree(node) {
      this._initNodeMapper();
      this._initContextMenuActionProviders();

      let viewNode = {
        nodeItem: node,
        id: node.$meta.id,
        version: node.$meta.version,
        desc: node.$meta.desc,
        contextMenuActionProvider: this.getNodeContexMenuActions,
      };
      if (node.services) {
        viewNode.services = node.services.map(service => ({
          nodeItem: service,
          desc: service.$meta.desc,
          viewNode: viewNode,
          contextMenuActionProvider: this.getServiceContexMenuActions,
        }));
      }
      if (node.decorators) {
        viewNode.decorators = node.decorators.map(decorator => ({
          nodeItem: decorator,
          desc: decorator.$meta.desc,
          viewNode: viewNode,
          contextMenuActionProvider: this.getDecoratorContexMenuActions,
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
