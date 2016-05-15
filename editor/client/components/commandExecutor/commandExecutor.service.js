'use strict';

(function() {
  class CommandExecutor {
    constructor(_, $q, $injector, UndoRedoManager) {
      this._ = _;
      this._$q = $q;
      this._$injector = $injector;
      this._undoRedoManager = UndoRedoManager;

      this.isBussy = false;
    }

    /**
     * Executes a command and optionally adds it to the undo/redo stack (if command object returned from command service has undo function)
     * @param  {string} cmdName - service name that represents the command
     * @param  {Object} params  - parameters to be passed to the 'create' function of the command service
     * @return {Promise}
     */
    exec(cmdName, params) {
      if (this.isBussy) {
        throw new Error('CommandExecutor is bussy - it is not allowed to run command during another command execution');
      }

      let _this = this;

      this.isBussy = true;
      let resPromise;

      try {
        _this._$injector.invoke([cmdName, function(cmdSvc) {
          var cmd = cmdSvc.create(params);

          //undo redo stack
          if (_this._.isFunction(cmd.undo)) {
            _this._undoRedoManager.add(cmd);
          }

          //exec
          resPromise = _this._$q.when(cmd.exec())
            .then(() => _this._handleFinish())
            .catch((err) => {
              _this._handleFinish();
              throw err;
            });
        }]);
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
