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
      if (!this.getNodeContextMenuActions) {
        this.getNodeContextMenuActions = (node) => this._NodeItemAction.getNodeContextMenuActions(node);
      }
      if (!this.getServiceContextMenuActions) {
        this.getServiceContextMenuActions = (service) => this._NodeItemAction.getServiceContextMenuActions(service);
      }
      if (!this.getDecoratorContextMenuActions) {
        this.getDecoratorContextMenuActions = (decorator) => this._NodeItemAction.getDecoratorContextMenuActions(decorator);
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
        contextMenuActionProvider: this.getNodeContextMenuActions,
      };
      if (node.services) {
        viewNode.services = node.services.map(service => ({
          nodeItem: service,
          desc: service.$meta.desc,
          viewNode: viewNode,
          contextMenuActionProvider: this.getServiceContextMenuActions,
        }));
      }
      if (node.decorators) {
        viewNode.decorators = node.decorators.map(decorator => ({
          nodeItem: decorator,
          desc: decorator.$meta.desc,
          viewNode: viewNode,
          contextMenuActionProvider: this.getDecoratorContextMenuActions,
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
