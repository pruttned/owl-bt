'use strict';

(function() {
  class UndoCmd {
    constructor(CommandExecutor, UndoRedoManager) {
      this._CommandExecutor = CommandExecutor;
      this._undoRedoManager = UndoRedoManager;
    }

    exec() {
      this._CommandExecutor.exec({
        exec: () => {
          this._undoRedoManager.undo();
        },
      });
    }
  }

  angular.module('editorApp')
    .service('UndoCmd', UndoCmd);
})();
