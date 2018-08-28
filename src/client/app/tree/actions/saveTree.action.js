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
          if (_this._TreeStore.allItemPropertiesAreValid() || confirm('Tree contains items with invalid properties (check red items). Do you really want to save it?')) {
            return _this._TreeStore.save()
              .then(() => _this._AlertList.addInfo('Done', { autoHide: true }));
          }
        }
      });
    }
  }

  angular.module('editorApp')
    .service('SaveTreeAction', SaveTreeAction);
})();
