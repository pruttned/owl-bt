'use strict';

(function() {

  /**
   * Common node functions
   */
  class TreeNode {

    constructor(_, ArrayHelper) {
      this._ = _;
      this._ArrayHelper = ArrayHelper;
    }

    updateVersion(node) {
      if (node.$meta.version === Number.MAX_SAFE_INTEGER) {
        node.$meta.version = 1;
      } else {
        node.$meta.version++;
      }
    }

    addService(node, service) {
      if(service.$meta.nodeId && service.$meta.nodeId !== node.$meta.id){
        throw new Error('Service is already in another node');
      }
      if (!node.services) {
        node.services = [];
      }
      node.services.push(service);

      service.$meta.nodeId = node.$meta.id;
    }

    addDecorator(node, decorator) {
      if(decorator.$meta.nodeId && decorator.$meta.nodeId !== node.$meta.id){
        throw new Error('Decorator is already in another node');
      }

      if (!node.decorators) {
        node.decorators = [];
      }
      node.decorators.push(decorator);

      decorator.$meta.nodeId = node.$meta.id;
    }

    addChildNode(node, childNode) {
      if(childNode.$meta.parentId && childNode.$meta.parentId !== node.$meta.id){
        throw new Error('Node is already child of another node');
      }

      if (!node.childNodes) {
        node.childNodes = [];
      }
      node.childNodes.push(childNode);

      childNode.$meta.parentId = node.$meta.id;
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

    moveSubItem(node, subItem, up){
      let subItemArray = this._getSubItemArray(node, subItem);
      if(!subItemArray){
        return false;
      }
      if(up){
        return this._ArrayHelper.moveLeft(subItemArray, subItem);
      }else{
        return this._ArrayHelper.moveRight(subItemArray, subItem);
      }
    }

    _getSubItemArray(node, subItem){
      if(this.indexOfService(node, subItem) >= 0){
        return node.services;
      }
      if(this.indexOfDecorator(node, subItem) >= 0){
        return node.decorators;
      }
    }
  }

  angular.module('editorApp')
    .service('TreeNode', TreeNode);
})();
