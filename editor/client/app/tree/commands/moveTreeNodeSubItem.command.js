'use strict';

(function() {

  class MoveTreeNodeSubItemCommand {

    constructor(_, MoveTreeNodeSubItemAction, TreeStore, TreeSelection, TreeNode) {
      this._ = _;
      this._MoveTreeNodeSubItemAction = MoveTreeNodeSubItemAction;
      this._TreeStore = TreeStore;
      this._TreeSelection = TreeSelection;
      this._TreeNode = TreeNode;
    }

    canExec(cmdDesc) {
      if(this._TreeSelection.hasSelected() && this._TreeSelection.selItemType() !== 'node'){
        return this._TreeNode.canMoveSubItem(this._TreeSelection.selNode(), this._TreeSelection.selItem(), cmdDesc.up);
      }
      return false;
    }

    exec(cmdDesc) {
      if (this.canExec(cmdDesc)) {
        return this._MoveTreeNodeSubItemAction.exec({
          node: this._TreeSelection.selNode(),
          subItem: this._TreeSelection.selItem(),
          up: cmdDesc.up
        });
      }
    }
  }
  angular.module('editorApp')
    .service('MoveTreeNodeSubItemCommand', MoveTreeNodeSubItemCommand)
    .config(function(CommandPaletteCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'MoveTreeNodeSubItemCommand',
        name: 'core:Move Up',
        icon: 'arrow-up',
        hotkey: 'shift+up',
        up: true
      });
      CommandPaletteCfgProvider.addCommand({
        service: 'MoveTreeNodeSubItemCommand',
        name: 'core:Move Down',
        icon: 'arrow-down',
        hotkey: 'shift+down',
        up: false
      });
    });
})();
