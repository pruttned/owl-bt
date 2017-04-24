'use strict';

(function () {

  class SaveTreeCommand {

    constructor(SaveTreeAction, TreeStore) {
      this._SaveTreeAction = SaveTreeAction;
      this._TreeStore = TreeStore;
    }

    canExec() {
      return this._TreeStore.isLoaded;
    }

    exec() {
      if (this.canExec()) {
        this._SaveTreeAction.exec();
      }
    }
  }

  angular.module('editorApp')
    .service('SaveTreeCommand', SaveTreeCommand)
    .config(function (CommandPaletteCfgProvider, CommandTopMenuCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'SaveTreeCommand',
        name: 'core:Save',
        icon: 'save',
        hotkey: 'mod+s',
        allowHotkeyInForms: true
      });
     CommandTopMenuCfgProvider.addMenuItem({
        title: 'Save',
        section: 'File',
        command: 'core:Save',
        order: 100
      });
    });
})();
