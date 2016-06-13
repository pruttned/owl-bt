'use strict';

(function() {

  class RemoveTreeNodeItemCommand {

    constructor(_, RemoveTreeNodeAction, RemoveTreeNodeSubItemAction, TreeNodeByIdStore, TreeStore, TreeSelection) {
      this._ = _;
      this._RemoveTreeNodeAction = RemoveTreeNodeAction;
      this._RemoveTreeNodeSubItemAction = RemoveTreeNodeSubItemAction;
      this._TreeNodeByIdStore = TreeNodeByIdStore;
      this._TreeStore = TreeStore;
      this._TreeSelection = TreeSelection;
    }

    canExec() {
      return this._TreeSelection.hasSelected() && (this._TreeSelection.selItemType() !== 'node' || this._TreeSelection.selItem().$meta.parentId);
    }

    exec() {
      if (this.canExec()) {
        let selItem = this._TreeSelection.selItem();
        if (this._TreeSelection.selItemType() === 'node') {
          let parentNode = this._TreeNodeByIdStore.getNode(selItem.$meta.parentId);
          return this._RemoveTreeNodeAction.exec({
            node: parentNode,
            childNode: selItem,
          });
        } else {
          let selNode = this._TreeSelection.selNode();
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
        icon: 'remove',
        hotkey: 'del'
      });

      CommandContextMenuCfgProvider.addMenuItem({
        title: 'Remove',
        command: 'core:Remove',
        order: 300
      });
    });
})();
