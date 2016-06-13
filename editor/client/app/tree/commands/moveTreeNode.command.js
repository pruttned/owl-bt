'use strict';

(function() {

  class MoveTreeNodeCommand {

    constructor(_, MoveTreeNodeAction, TreeNodeByIdStore, TreeStore, TreeSelection, TreeNode) {
      this._ = _;
      this._MoveTreeNodeAction = MoveTreeNodeAction;
      this._TreeNodeByIdStore = TreeNodeByIdStore;
      this._TreeStore = TreeStore;
      this._TreeSelection = TreeSelection;
      this._TreeNode = TreeNode;
    }

    canExec(cmdDesc) {
      if(this._TreeSelection.hasSelected() && this._TreeSelection.selItemType() === 'node' && this._TreeSelection.selItem().$meta.parentId){
        let node = this._TreeSelection.selItem();
        let parentNode = this._TreeNodeByIdStore.getNode(node.$meta.parentId);
        return this._TreeNode.canMoveChildNode(parentNode, node, cmdDesc.left);
      }
      return false;
    }

    exec(cmdDesc) {
      if (this.canExec(cmdDesc)) {
        let node = this._TreeSelection.selItem();
        let parentNode = this._TreeNodeByIdStore.getNode(node.$meta.parentId);
        return this._MoveTreeNodeAction.exec({
          node: parentNode,
          childNode: node,
          left: cmdDesc.left
        });
      }
    }
  }
  angular.module('editorApp')
    .service('MoveTreeNodeCommand', MoveTreeNodeCommand)
    .config(function(CommandPaletteCfgProvider, CommandContextMenuCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'MoveTreeNodeCommand',
        name: 'core:Move Left',
        icon: 'arrow-left',
        hotkey: 'shift+left',
        left: true
      });
      CommandPaletteCfgProvider.addCommand({
        service: 'MoveTreeNodeCommand',
        name: 'core:Move Right',
        icon: 'arrow-right',
         hotkey: 'shift+right',
        left: false
      });

      CommandContextMenuCfgProvider.addMenuItem({
        title: 'Move Left',
        command: 'core:Move Left',
        order: 100
      });
      CommandContextMenuCfgProvider.addMenuItem({
        title: 'Move Right',
        command: 'core:Move Right',
        order: 101
      });
    });
})();
