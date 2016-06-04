'use strict';

(function() {
  class SaveTreeCmd {
    constructor(CommandExecutor, TreeStore) {
      this._CommandExecutor = CommandExecutor;
      this._TreeStore = TreeStore;
    }

    exec() {
      let _this = this;
      this._CommandExecutor.exec({
        exec: () => {
          return _this._TreeStore.save();
        }
      });
    }
  }

  angular.module('editorApp')
    .service('SaveTreeCmd', SaveTreeCmd);
})();
