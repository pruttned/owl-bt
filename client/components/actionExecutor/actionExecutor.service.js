'use strict';

(function() {
  class ActionExecutor {
    constructor(_, $q, $injector, UndoRedoManager) {
      this._ = _;
      this._$q = $q;
      this._$injector = $injector;
      this._UndoRedoManager = UndoRedoManager;

      this.isBussy = false;
    }

    /**
     * Executes a action and optionally adds it to the undo/redo stack (if action object returned from action service has undo function)
     * @return {object} action
     * @return {function} action.exec - function for executing the action
     * @return {function} action.undo - (optional) function for undoing the action
     * @return {Promise}
     */
    exec(action) {
      if (this.isBussy) {
        throw new Error('ActionExecutor is bussy - it is not allowed to run action during another action execution');
      }

      let _this = this;

      this.isBussy = true;
      let resPromise;

      try {
        //undo redo stack
        if (_this._.isFunction(action.undo)) {
          _this._UndoRedoManager.add(action);
        }

        //exec
        resPromise = _this._$q.when(action.exec())
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
    .service('ActionExecutor', ActionExecutor);
})();
