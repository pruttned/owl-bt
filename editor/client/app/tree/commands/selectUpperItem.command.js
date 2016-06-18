'use strict';

(function() {

  class SelectUpperItemCommand {

    constructor(TreeStore, TreeNodeByIdStore, TreeSelection, TreeNode) {
      this._TreeStore = TreeStore;
      this._TreeNodeByIdStore = TreeNodeByIdStore;
      this._TreeSelection = TreeSelection;
      this._TreeNode = TreeNode;
    }

    canExec() {
      return !this._TreeSelection.hasSelected() || (this._TreeSelection.selItemType() !== 'node' || this._TreeSelection.selItem().$meta.parentId);
    }

    exec() {
      if (this.canExec()) {
        let selItem = this._TreeSelection.selItem();
        if (!selItem) {
          this._TreeSelection.select(this._TreeStore.rootNode, this._TreeStore.rootNode);
        } else {
          let selItemType = this._TreeSelection.selItemType();
          if (selItemType === 'node') {
            let parentNode = this._TreeNodeByIdStore.getNode(selItem.$meta.parentId);
            this._TreeSelection.select(parentNode, this.getLastSubItem(parentNode) || parentNode);
          } else {
            let selNode = this._TreeSelection.selNode();
            let index = this._TreeNode.indexOfSubItem(selNode, selItem);
            if (index === 0) {
              if (selItemType === 'service' && selNode.decorators && selNode.decorators.length) {
                this._TreeSelection.select(selNode, selNode.decorators[selNode.decorators.length - 1]);
              } else {
                this._TreeSelection.select(selNode, selNode);
              }
            } else {
              this._TreeSelection.select(selNode, this._TreeNode.getSubItemAt(selNode, selItemType, index - 1));
            }
          }
        }
      }
    }

    getLastSubItem(node) {
      if (node.services && node.services.length) {
        return node.services[node.services.length - 1];
      }
      if (node.decorators && node.decorators.length) {
        return node.decorators[node.decorators.length - 1];
      }
    }
  }

  angular.module('editorApp')
    .service('SelectUpperItemCommand', SelectUpperItemCommand)
    .config(function(CommandPaletteCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'SelectUpperItemCommand',
        name: 'core:Select Upper Item',
        icon: 'arrow-up',
        hotkey: 'up',
      });
    });
})();
