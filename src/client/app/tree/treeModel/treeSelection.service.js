(function () {
  'use strict';

  class TreeSelection {
    constructor(_, TreeNode, NodeItemPropertiesForm, AlertList) {
      this._ = _;
      this._TreeNode = TreeNode;
      this._NodeItemPropertiesForm = NodeItemPropertiesForm;
      this._AlertList = AlertList;

      this._selNode = null;
      this._selItem = null;
      this._selItemType = null;
    }

    /**
     * whether is something selected
     * @return {Boolean}
     */
    hasSelected() {
      return !this._.isNil(this._selNode) && !this._.isNil(this._selItem);
    }

    /**
     * whether is specified item selected
     * @return {Boolean}
     */
    isSelected(item) {
      return this._selItem === item;
    }

    selNode() {
      return this._selNode;
    }

    selItem() {
      return this._selItem;
    }

    /**
     * gets the type of the currently selected item
     * @return {string} 'node' or 'service' or 'decorator'
     */
    selItemType() {
      return this._selItemType;
    }

    /**
     * select/deselect specified item
     * @param  {node|service|decorator} item - selected item. null for deselect
     * @param  {node} node - node that contains the specified sub item or the same node as in item in case of selected node
     */
    select(node, item) {
      if (this._NodeItemPropertiesForm.isValid()) {
        this._selNode = node;
        this._selItem = item;

        if (item) {
          if (item === node) {
            this._selItemType = 'node';
          } else {
            this._selItemType = this._TreeNode.getSubItemType(node, item);
          }
        } else {
          this._selItemType = null;
        }
      } else {
        this._AlertList.addErr('Properties of selected node item are not valid');
      }
    }
  }

  angular.module('editorApp')
    .service('TreeSelection', TreeSelection);
})();
