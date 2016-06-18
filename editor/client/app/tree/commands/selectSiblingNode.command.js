'use strict';

(function() {

  class SelectSiblingNodeCommand {

    constructor(TreeStore, TreeNodeByIdStore, TreeSelection, TreeNode, TreeFocus) {
      this._TreeStore = TreeStore;
      this._TreeNodeByIdStore = TreeNodeByIdStore;
      this._TreeSelection = TreeSelection;
      this._TreeNode = TreeNode;
      this._TreeFocus = TreeFocus;
    }

    canExec(cmdDesc) {
      return !this._TreeSelection.hasSelected() || this._getSiblingNode(cmdDesc.left);
    }

    exec(cmdDesc) {
      if (this.canExec(cmdDesc)) {
        let selItem = this._TreeSelection.selItem();
        if (!selItem) {
          this._select(this._TreeStore.rootNode, this._TreeStore.rootNode);
        } else {
          let sibling = this._getSiblingNode(cmdDesc.left);
          if (sibling) {
            this._select(sibling, sibling);
          }
        }
      }
    }

    _select(node, item){
      this._TreeSelection.select(node, item);
      this._TreeFocus.focusNode(node);
    }

    _getSiblingNode(left) {
      let selNode = this._TreeSelection.selNode();
      if (selNode.$meta.parentId) {
        let parentNode = this._TreeNodeByIdStore.getNode(selNode.$meta.parentId);
        let index = parentNode.childNodes.indexOf(selNode);
        if (left) {
          if (index > 0) {
            return parentNode.childNodes[index - 1];
          }
        } else {
          if (index < parentNode.childNodes.length - 1) {
            return parentNode.childNodes[index + 1];
          }
        }
      }
    }
  }

  angular.module('editorApp')
    .service('SelectSiblingNodeCommand', SelectSiblingNodeCommand)
    .config(function(CommandPaletteCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'SelectSiblingNodeCommand',
        name: 'core:Select Left Node',
        icon: 'arrow-left',
        hotkey: 'left',
        left: true
      });
      CommandPaletteCfgProvider.addCommand({
        service: 'SelectSiblingNodeCommand',
        name: 'core:Select Right Node',
        icon: 'arrow-right',
        hotkey: 'right',
        left: false
      });
    });
})();
