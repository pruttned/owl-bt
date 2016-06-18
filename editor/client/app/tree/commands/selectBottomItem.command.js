'use strict';

(function() {

  class SelectBottomItemCommand {

    constructor(TreeStore, TreeNodeByIdStore, TreeSelection, TreeNode) {
      this._TreeStore = TreeStore;
      this._TreeNodeByIdStore = TreeNodeByIdStore;
      this._TreeSelection = TreeSelection;
      this._TreeNode = TreeNode;
    }

    canExec() {
      return !this._TreeSelection.hasSelected() || this._getBottomItem();
    }

    exec() {
      if (this.canExec()) {
        let selItem = this._TreeSelection.selItem();
        if (!selItem) {
          this._TreeSelection.select(this._TreeStore.rootNode, this._TreeStore.rootNode);
        } else {
          let bottomItem = this._getBottomItem();
          if (bottomItem) {
            this._TreeSelection.select(bottomItem.node, bottomItem.item);
          }
        }
      }
    }

    _getBottomItem() {
      let selItem = this._TreeSelection.selItem();
      let selNode = this._TreeSelection.selNode();
      let selItemType = this._TreeSelection.selItemType();
      if (selItemType === 'node') {
        if (selNode.decorators && selNode.decorators.length) {
          return {
            node: selNode,
            item: selNode.decorators[0]
          };
        }
        if (selNode.services && selNode.services.length) {
          return {
            node: selNode,
            item: selNode.services[0]
          };
        }
        return this._getBottomNodeSel();
      } else {
        let index = this._TreeNode.indexOfSubItem(selNode, selItem);
        let itemCnt = this._TreeNode.getSubItemCount(selNode, selItemType);
        if (index === itemCnt - 1) {
          if (selItemType === 'decorator' && selNode.services && selNode.services.length) {
            return {
              node: selNode,
              item: selNode.services[0]
            };
          } else {
            return this._getBottomNodeSel();
          }
        } else {
          return {
            node: selNode,
            item: this._TreeNode.getSubItemAt(selNode, selItemType, index + 1)
          };
        }
      }
    }

    _getBottomNodeSel() {
      let selNode = this._TreeSelection.selNode();
      if (selNode.childNodes && selNode.childNodes.length) {
        let bottomNode = selNode.childNodes[Math.floor((selNode.childNodes.length - 1) / 2)];
        return {
          node: bottomNode,
          item: bottomNode
        };
      }
    }
  }

  angular.module('editorApp')
    .service('SelectBottomItemCommand', SelectBottomItemCommand)
    .config(function(CommandPaletteCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'SelectBottomItemCommand',
        name: 'core:Select Bottom Item',
        icon: 'arrow-down',
        hotkey: 'down',
      });
    });
})();
