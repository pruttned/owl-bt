'use strict';

(function () {

  class PasteTreeNodeItemCommand {

    constructor(_, PasteTreeNodeItemAction, TreeSelection, Clipboard, TreeNode) {
      this._ = _;
      this._TreeSelection = TreeSelection;
      this._PasteTreeNodeItemAction = PasteTreeNodeItemAction;
      this._Clipboard = Clipboard;
      this._TreeNode = TreeNode;
    }

    canExec() {
      let treeClipboardItem = this._Clipboard.get('tree');
      return this._TreeSelection.hasSelected() && treeClipboardItem && (treeClipboardItem.itemType !== 'node' || this._TreeSelection.selNode().$meta.desc.isComposite);
    }

    exec() {
      if (this.canExec()) {
        let selNode = this._TreeSelection.selNode();
        let selItemType = this._TreeSelection.selItemType();

        let treeClipboardItem = this._Clipboard.get('tree');
        let index;
        if (treeClipboardItem.itemType !== 'node' && selItemType !== 'node') {
          index = this._TreeNode.indexOfSubItem(selNode, this._TreeSelection.selItem()) + 1;
        }
        return this._PasteTreeNodeItemAction.exec({
          node: selNode,
          index: index
        });
      }
    }
  }

  angular.module('editorApp')
    .service('PasteTreeNodeItemCommand', PasteTreeNodeItemCommand)
    .config(function (CommandPaletteCfgProvider, CommandContextMenuCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'PasteTreeNodeItemCommand',
        name: 'core:Paste',
        icon: 'paste',
        hotkey: 'mod+v'
      });

      CommandContextMenuCfgProvider.addMenuItem({
        title: 'Paste',
        command: 'core:Paste',
        order: 201
      });
    });
})();
