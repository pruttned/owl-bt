'use strict';

(function() {
  class CommandExecutor {
    constructor(_, $q, $injector, UndoRedoManager) {
      this._ = _;
      this._$q = $q;
      this._$injector = $injector;
      this._UndoRedoManager = UndoRedoManager;

      this.isBussy = false;
    }

    /**
     * Executes a command and optionally adds it to the undo/redo stack (if command object returned from command service has undo function)
     * @return {object} cmd
     * @return {function} cmd.exec - function for executing the command
     * @return {function} cmd.undo - (optional) function for undoing the command
     * @return {Promise}
     */
    exec(cmd) {
      if (this.isBussy) {
        throw new Error('CommandExecutor is bussy - it is not allowed to run command during another command execution');
      }

      let _this = this;

      this.isBussy = true;
      let resPromise;

      try {
        //undo redo stack
        if (_this._.isFunction(cmd.undo)) {
          _this._UndoRedoManager.add(cmd);
        }

        //exec
        resPromise = _this._$q.when(cmd.exec())
          .then(() => _this._handleFinish())
          .catch((err) => {
            _this._handleFinish();
            throw err;
          });
      } catch (err) {
        _this._handleFinish();
        throw err;
      }
      return resPromise;
    }

    _handleFinish() {
      this.isBussy = false;
    }
  }

  angular.module('editorApp')
    .service('CommandExecutor', CommandExecutor);
})();
