'use strict';

(function() {
  class UndoCmd {
    constructor(UndoRedoManager) {
        this._undoRedoManager = UndoRedoManager;
      }
      /**
       * @return {Object} cmd - command instance
       * @return {function} cmd.exec - function for executing the command
       */
    create() {
      return {
        exec: () => {
          this._undoRedoManager.undo();
        },
      };
    }
  }

  angular.module('editorApp')
    .service('UndoCmd', UndoCmd);
})();
