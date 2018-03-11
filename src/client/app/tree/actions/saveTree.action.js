(function () {
  'use strict';

  class SaveTreeAction {
    constructor(ActionExecutor, TreeStore, NodeItemPropertiesForm, AlertList) {
      this._ActionExecutor = ActionExecutor;
      this._TreeStore = TreeStore;
      this._NodeItemPropertiesForm = NodeItemPropertiesForm;
      this._AlertList = AlertList;
    }

    exec() {
      let _this = this;
      if (this._NodeItemPropertiesForm.isValid()) {
        this._ActionExecutor.exec({
          exec: () => {
            return _this._TreeStore.save();
          }
        });
      } else {
        _this._AlertList.addErr('Properties of selected node item are not valid');
      }
    }
  }

  angular.module('editorApp')
    .service('SaveTreeAction', SaveTreeAction);
})();
