'use strict';

(function () {

  class CopyTreeNodeItemCommand {

    constructor(_, CopyTreeNodeItemAction, TreeSelection) {
      this._ = _;
      this._TreeSelection = TreeSelection;
      this._CopyTreeNodeItemAction = CopyTreeNodeItemAction;
    }

    canExec() {
      return this._TreeSelection.hasSelected();
    }

    exec() {
      if (this.canExec()) {
        let _this = this;
        return _this._CopyTreeNodeItemAction.exec({
          nodeItem: this._TreeSelection.selItem(),
          nodeItemType: this._TreeSelection.selItemType()
        });
      }
    }
  }

  angular.module('editorApp')
    .service('CopyTreeNodeItemCommand', CopyTreeNodeItemCommand)
    .config(function (CommandPaletteCfgProvider, CommandContextMenuCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'CopyTreeNodeItemCommand',
        name: 'core:Copy',
        icon: 'copy',
        hotkey: 'mod+c'
      });

      CommandContextMenuCfgProvider.addMenuItem({
        title: 'Copy',
        command: 'core:Copy',
        order: 200
      });
    });
})();
