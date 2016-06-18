'use strict';

(function() {

  class FocusSelNodeCommand {

    constructor(TreeSelection, TreeFocus) {
      this._TreeSelection = TreeSelection;
      this._TreeFocus = TreeFocus;
    }

    canExec() {
      return this._TreeSelection.hasSelected();
    }

    exec() {
      if (this.canExec()) {
        this._TreeFocus.focusNode(this._TreeSelection.selNode());
      }
    }
  }

  angular.module('editorApp')
    .service('FocusSelNodeCommand', FocusSelNodeCommand)
    .config(function(CommandPaletteCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'FocusSelNodeCommand',
        name: 'core:Focus Selected Node',
        icon: 'crosshairs'
      });
    });
})();
