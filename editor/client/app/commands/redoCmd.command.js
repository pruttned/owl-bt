'use strict';

(function() {
  class RedoCmd {
    constructor(CommandExecutor, UndoRedoManager) {
      this._CommandExecutor = CommandExecutor;
      this._undoRedoManager = UndoRedoManager;
    }

    exec() {
      this._CommandExecutor.exec({
        exec: () => {
          this._undoRedoManager.redo();
        },
      });
    }
  }

  angular.module('editorApp')
    .service('RedoCmd', RedoCmd);
})();
