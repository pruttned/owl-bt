'use strict';

(function() {
  class RedoCmd {
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
          this._undoRedoManager.redo();
        },
      };
    }
  }

  angular.module('editorApp')
    .service('RedoCmd', RedoCmd);
})();
