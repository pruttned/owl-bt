'use strict';

(function () {

  class UndoCommand {

    constructor(UndoRedoManager, UndoAction) {
      this._UndoRedoManager = UndoRedoManager;
      this._UndoAction = UndoAction;
    }

    canExec() {
      return this._UndoRedoManager.hasUndo();
    }

    exec() {
      if (this.canExec()) {
        this._UndoAction.exec();
      }
    }
  }

  angular.module('editorApp')
    .service('UndoCommand', UndoCommand)
    .config(function (CommandPaletteCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'UndoCommand',
        name: 'core:Undo',
        icon: 'undo',
        hotkey: 'mod+z'
      });
    });
})();
