'use strict';

(function() {
  class UndoAction {
    constructor(ActionExecutor, UndoRedoManager) {
      this._ActionExecutor = ActionExecutor;
      this._undoRedoManager = UndoRedoManager;
    }

    exec() {
      this._ActionExecutor.exec({
        exec: () => {
          this._undoRedoManager.undo();
        },
      });
    }
  }

  angular.module('editorApp')
    .service('UndoAction', UndoAction);
})();
