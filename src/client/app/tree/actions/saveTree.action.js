(function () {
  'use strict';

  class SaveTreeAction {
    constructor(ActionExecutor, TreeStore, AlertList) {
      this._ActionExecutor = ActionExecutor;
      this._TreeStore = TreeStore;
      this._AlertList = AlertList;
    }

    exec() {
      let _this = this;
      this._ActionExecutor.exec({
        exec: () => {
          return _this._TreeStore.save()
            .then(() => _this._AlertList.addInfo('Done', { autoHide: true }));
        }
      });
    }
  }

  angular.module('editorApp')
    .service('SaveTreeAction', SaveTreeAction);
})();
