'use strict';

(function() {
  class SaveTreeAction {
    constructor(ActionExecutor, TreeStore) {
      this._ActionExecutor = ActionExecutor;
      this._TreeStore = TreeStore;
    }

    exec() {
      let _this = this;
      this._ActionExecutor.exec({
        exec: () => {
          return _this._TreeStore.save();
        }
      });
    }
  }

  angular.module('editorApp')
    .service('SaveTreeAction', SaveTreeAction);
})();
