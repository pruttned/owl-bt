'use strict';

(function () {

  class RedoCommand {

    constructor(UndoRedoManager, RedoAction) {
      this._UndoRedoManager = UndoRedoManager;
      this._RedoAction = RedoAction;
    }

    canExec() {
      return this._UndoRedoManager.hasRedo();
    }

    exec() {
      if (this.canExec()) {
        this._RedoAction.exec();
      }
    }
  }

  angular.module('editorApp')
    .service('RedoCommand', RedoCommand)
    .config(function (CommandPaletteCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'RedoCommand',
        name: 'core:Redo',
        icon: 'repeat',
        hotkey: 'mod+y'
      });
    });
})();
