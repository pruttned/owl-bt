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
      this._addSubItem(node, 'services', service);
    }

    addDecorator(node, decorator) {
      this._addSubItem(node, 'decorators', decorator);
    }

    /**
     * add sub item
     * @param {node} node
     * @param {service|decorator} subItem
     * @param {string} type  - 'service' or 'decorator'
     */
    addSubItem(node, subItem, type) {
      if(type !== 'service' && type !== 'decorator'){
        throw new Error(`invalid sub item type ${type}`);
      }
      this._addSubItem(node, type + 's', subItem);
    }

    addChildNode(node, childNode) {
      if (childNode.$meta.parentId && childNode.$meta.parentId !== node.$meta.id) {
        throw new Error('Node is already child of another node');
      }

      if (!node.childNodes) {
        node.childNodes = [];
      }
      node.childNodes.push(childNode);

      childNode.$meta.parentId = node.$meta.id;
    }

    removeService(node, service) {
      return this._removeSubItem(node, 'services', service);
    }

    removeDecorator(node, decorator) {
      return this._removeSubItem(node, 'decorators', decorator);
    }

    removeSubItem(node, subItem) {
      let subItemArrayName = this._getSubItemArrayName(node, subItem);
      if (!subItemArrayName) {
        return false;
      }
      return this._removeSubItem(node, subItemArrayName, subItem);
    }

    removeChildNode(node, childNode) {
      if (!node.childNodes) {
        return false;
      }
      if (this._ArrayHelper.remove(node.childNodes, childNode)) {
        delete childNode.$meta.parentId;
        return true;
      }
      return false;
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

    moveChildNode(node, childNode, left) {
      if (!node.childNodes) {
        return false;
      }
      if (left) {
        return this._ArrayHelper.moveLeft(node.childNodes, childNode);
      } else {
        return this._ArrayHelper.moveRight(node.childNodes, childNode);
      }
    }

    canMoveChildNode(node, childNode, left) {
      if (!node.childNodes) {
        return false;
      }
      if (left) {
        return this._ArrayHelper.canMoveLeft(node.childNodes, childNode);
      } else {
        return this._ArrayHelper.canMoveRight(node.childNodes, childNode);
      }
    }

    moveSubItem(node, subItem, up) {
      let subItemArray = this._getSubItemArray(node, subItem);
      if (!subItemArray) {
        return false;
      }
      if (up) {
        return this._ArrayHelper.moveLeft(subItemArray, subItem);
      } else {
        return this._ArrayHelper.moveRight(subItemArray, subItem);
      }
    }

    canMoveSubItem(node, subItem, up) {
      let subItemArray = this._getSubItemArray(node, subItem);
      if (!subItemArray) {
        return false;
      }
      if (up) {
        return this._ArrayHelper.canMoveLeft(subItemArray, subItem);
      } else {
        return this._ArrayHelper.canMoveRight(subItemArray, subItem);
      }
    }

    /**
     * Get type (decorator/service) of the subItem in the node
     * @param  {node} node   - node that contains the sub item
     * @param  {service|decorator} subItem
     * @return {string} 'service' or 'decorator'
     */
    getSubItemType(node, subItem) {
      if (this.indexOfService(node, subItem) >= 0) {
        return 'service';
      }
      if (this.indexOfDecorator(node, subItem) >= 0) {
        return 'decorator';
      }
    }

    _getSubItemArrayName(node, subItem) {
      let type = this.getSubItemType(node, subItem);
      if (type) {
        return type + 's';
      }
    }

    _getSubItemArray(node, subItem) {
      let subItemArrayName = this._getSubItemArrayName(node, subItem);
      if (subItemArrayName) {
        return node[subItemArrayName];
      }
    }

    _addSubItem(node, subItemArrayName, subItem) {
      if (subItem.$meta.nodeId && subItem.$meta.nodeId !== node.$meta.id) {
        throw new Error('Sub item is already in another node');
      }
      if (!node[subItemArrayName]) {
        node[subItemArrayName] = [];
      }
      node[subItemArrayName].push(subItem);

      subItem.$meta.nodeId = node.$meta.id;
    }

    _removeSubItem(node, subItemArrayName, subItem) {
      if (!node[subItemArrayName]) {
        return false;
      }
      if (this._ArrayHelper.remove(node[subItemArrayName], subItem)) {
        delete subItem.$meta.nodeId;
        return true;
      }
      return false;
    }
  }

  angular.module('editorApp')
    .service('TreeNode', TreeNode);
})();
