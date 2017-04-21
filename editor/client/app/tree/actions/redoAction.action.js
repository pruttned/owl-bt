'use strict';

(function() {
  class RedoAction {
    constructor(ActionExecutor, UndoRedoManager) {
      this._ActionExecutor = ActionExecutor;
      this._undoRedoManager = UndoRedoManager;
    }

    exec() {
      this._ActionExecutor.exec({
        exec: () => {
          this._undoRedoManager.redo();
        },
      });
    }
  }

  angular.module('editorApp')
    .service('RedoAction', RedoAction);
})();
