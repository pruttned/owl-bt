'use strict';

(function() {

  class RemoveTreeNodeItemCommand {

    constructor(_, RemoveTreeNodeAction, RemoveTreeNodeSubItemAction, TreeNodeByIdStore, TreeStore, TreeSelection, TreeNode) {
      this._ = _;
      this._RemoveTreeNodeAction = RemoveTreeNodeAction;
      this._RemoveTreeNodeSubItemAction = RemoveTreeNodeSubItemAction;
      this._TreeNodeByIdStore = TreeNodeByIdStore;
      this._TreeStore = TreeStore;
      this._TreeSelection = TreeSelection;
      this._TreeNode = TreeNode;
    }

    canExec() {
      return this._TreeSelection.hasSelected() && (this._TreeSelection.selItemType() !== 'node' || this._TreeSelection.selItem().$meta.parentId);
    }

    exec() {
      if (this.canExec()) {
        let selItem = this._TreeSelection.selItem();
        let selNode = this._TreeSelection.selNode();
        let aboveItem = this._TreeNode.getAboveNodeItem(selNode, selItem);
        let selItemType = this._TreeSelection.selItemType();

        this._TreeSelection.select(aboveItem.node, aboveItem.item);

        if (selItemType === 'node') {
          let parentNode = this._TreeNodeByIdStore.getNode(selItem.$meta.parentId);
          return this._RemoveTreeNodeAction.exec({
            node: parentNode,
            childNode: selItem,
          });
        } else {
          return this._RemoveTreeNodeSubItemAction.exec({
            node: selNode,
            subItem: selItem
          });
        }
      }
    }
  }
  angular.module('editorApp')
    .service('RemoveTreeNodeItemCommand', RemoveTreeNodeItemCommand)
    .config(function(CommandPaletteCfgProvider, CommandContextMenuCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'RemoveTreeNodeItemCommand',
        name: 'core:Remove',
        icon: 'times',
        hotkey: 'del'
      });

      CommandContextMenuCfgProvider.addMenuItem({
        title: 'Remove',
        command: 'core:Remove',
        order: 300
      });
    });
})();
