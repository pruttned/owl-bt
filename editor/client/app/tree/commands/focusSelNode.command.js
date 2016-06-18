'use strict';

(function() {

  class FocusSelNode {

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
    .service('FocusSelNode', FocusSelNode)
    .config(function(CommandPaletteCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'FocusSelNode',
        name: 'core:Focus Selected Node',
        icon: 'crosshairs'
      });
    });
})();
