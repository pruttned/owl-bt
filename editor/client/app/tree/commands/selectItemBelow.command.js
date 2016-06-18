'use strict';

(function() {

  class SelectItemBelowCommand {

    constructor(TreeStore, TreeSelection, TreeNode) {
      this._TreeStore = TreeStore;
      this._TreeSelection = TreeSelection;
      this._TreeNode = TreeNode;
    }

    canExec() {
      return !this._TreeSelection.hasSelected() || this._TreeNode.getBelowNodeItem(this._TreeSelection.selNode(), this._TreeSelection.selItem());
    }

    exec() {
      if (this.canExec()) {
        let selItem = this._TreeSelection.selItem();
        if (!selItem) {
          this._TreeSelection.select(this._TreeStore.rootNode, this._TreeStore.rootNode);
        } else {
          let belowItem = this._TreeNode.getBelowNodeItem(this._TreeSelection.selNode(), selItem);
          if (belowItem) {
            this._TreeSelection.select(belowItem.node, belowItem.item);
          }
        }
      }
    }
  }

  angular.module('editorApp')
    .service('SelectItemBelowCommand', SelectItemBelowCommand)
    .config(function(CommandPaletteCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'SelectItemBelowCommand',
        name: 'core:Select Item Below',
        icon: 'arrow-down',
        hotkey: 'down',
      });
    });
})();
