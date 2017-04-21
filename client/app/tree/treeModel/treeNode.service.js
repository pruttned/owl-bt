'use strict';

(function() {

  /**
   * Common node functions
   */
  class TreeNode {

    constructor(_, ArrayHelper, TreeNodeByIdStore) {
      this._ = _;
      this._ArrayHelper = ArrayHelper;
      this._TreeNodeByIdStore = TreeNodeByIdStore;
    }

    updateVersion(node) {
      if (node.$meta.version === Number.MAX_SAFE_INTEGER) {
        node.$meta.version = 1;
      } else {
        node.$meta.version++;
      }
    }

    /**
     * gets sub item at a given index
     * @param {node} node
     * @param {string} type  - 'service' or 'decorator'
     * @param {int} index
     * @return sub item if exists
     */
    getSubItemAt(node, type, index) {
      this._checkSubItemType(type);
      return node[type + 's'][index];
    }

    /**
     * gets number of sub items
     * @param {node} node
     * @param {string} type  - 'service' or 'decorator'
     */
    getSubItemCount(node, type) {
      this._checkSubItemType(type);
      let array = node[type + 's'];
      if (!array) {
        return 0;
      }
      return array.length;
    }

    /**
     * returns item that is above the specified node item (in render order (parent node/decorators/services)-(node/decorators/services))
     * @param  {Node} node - node  that contains the specified item or the node alone
     * @param  {Node|Service|Decorator} item
     * @return {Object}  - def - above item def if exists
     * @return {Node|Service|Decorator} - def.item  - above item
     * @return {Node} - def.node  - node that contains the specified item, or the node itself
     */
    getAboveNodeItem(node, item) {
      if (node === item) { //node
        let parentNode = this._TreeNodeByIdStore.getNode(item.$meta.parentId);
        return {
          node: parentNode,
          item: this._getLastSubItem(parentNode) || parentNode
        };
      } else {
        let index = this.indexOfSubItem(node, item);
        let itemType = this.getSubItemType(node, item);
        if (index === 0) {
          if (itemType === 'service' && node.decorators && node.decorators.length) {
            return {
              node: node,
              item: node.decorators[node.decorators.length - 1]
            };
          } else {
            return {
              node: node,
              item: node
            };
          }
        } else {
          return {
            node: node,
            item: this.getSubItemAt(node, itemType, index - 1)
          };
        }
      }
    }

    /**
     * returns item that is below the specified node item (in render order (parent node/decorators/services)-(node/decorators/services))
     * @param  {Node} node - node  that contains the specified item or the node alone
     * @param  {Node|Service|Decorator} item
     * @return {Object}  - def - below item def if exists
     * @return {Node|Service|Decorator} - def.item  - above item
     * @return {Node} - def.node  - node that contains the specified item, or the node itself
     */
    getBelowNodeItem(node, item) {
      if (node === item) { //node
        if (node.decorators && node.decorators.length) {
          return {
            node: node,
            item: node.decorators[0]
          };
        }
        if (node.services && node.services.length) {
          return {
            node: node,
            item: node.services[0]
          };
        }
        return this._getBelowNodeSel(node);
      } else {
        let index = this.indexOfSubItem(node, item);
        let itemType = this.getSubItemType(node, item);
        let itemCnt = this.getSubItemCount(node, itemType);
        if (index === itemCnt - 1) {
          if (itemType === 'decorator' && node.services && node.services.length) {
            return {
              node: node,
              item: node.services[0]
            };
          } else {
            return this._getBelowNodeSel(node);
          }
        } else {
          return {
            node: node,
            item: this.getSubItemAt(node, itemType, index + 1)
          };
        }
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
      this.addSubItemAt(node, subItem, type);
    }

    /**
     * add sub item at a given index
     * @param {node} node
     * @param {service|decorator} subItem
     * @param {string} type  - 'service' or 'decorator'
     * @param {int} index - (optional) Item is added to the end if not provided
     */
    addSubItemAt(node, subItem, type, index) {
      this._checkSubItemType(type);
      this._addSubItem(node, type + 's', subItem, index);
    }

    addChildNode(node, childNode) {
      this.addChildNodeAt(node, childNode);
    }

    /**
     * add child node at a given index
     * @param {node} node
     * @param {node} childNode
     * @param {int} index - (optional) Child node is added to the end if not provided
     */
    addChildNodeAt(node, childNode, index) {
      if (childNode.$meta.parentId && childNode.$meta.parentId !== node.$meta.id) {
        throw new Error('Node is already child of another node');
      }

      if (!node.childNodes) {
        node.childNodes = [];
      }
      if (this._.isUndefined(index)) {
        index = node.childNodes.length;
      }
      node.childNodes.splice(index, 0, childNode);

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

    indexOfChildNode(node, childNode) {
      if (node.childNodes) {
        return this._.indexOf(node.childNodes, childNode);
      }
      return -1;
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

    indexOfSubItem(node, subItem) {
      let index = this.indexOfService(node, subItem);
      if (index >= 0) {
        return index;
      }
      return this.indexOfDecorator(node, subItem);
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

    _addSubItem(node, subItemArrayName, subItem, index) {
      if (subItem.$meta.nodeId && subItem.$meta.nodeId !== node.$meta.id) {
        throw new Error('Sub item is already in another node');
      }

      if (!node[subItemArrayName]) {
        node[subItemArrayName] = [];
      }
      if (this._.isUndefined(index)) {
        index = node[subItemArrayName].length;
      }
      node[subItemArrayName].splice(index, 0, subItem);

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

    _checkSubItemType(type) {
      if (type !== 'service' && type !== 'decorator') {
        throw new Error(`invalid sub item type ${type}`);
      }
    }

    _getLastSubItem(node) {
      if (node.services && node.services.length) {
        return node.services[node.services.length - 1];
      }
      if (node.decorators && node.decorators.length) {
        return node.decorators[node.decorators.length - 1];
      }
    }

    _getBelowNodeSel(node) {
      if (node.childNodes && node.childNodes.length) {
        let bottomNode = node.childNodes[Math.floor((node.childNodes.length - 1) / 2)];
        return {
          node: bottomNode,
          item: bottomNode
        };
      }
    }

  }

  angular.module('editorApp')
    .service('TreeNode', TreeNode);
})();
