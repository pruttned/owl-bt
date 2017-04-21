'use strict';

(function() {

  class CommandPaletteCfg {

    constructor() {
      this.commands = [];
    }

    /**
     * register context menu action for services
     * @param  {Object} commandDesc
     * @param  {String} commandDesc.service - name of the service, that handles the specified command
     * @param  {String} (optional) commandDesc.name - command title to be displayed
     * @param  {String} (optional) commandDesc.icon - command icon
     * @param  {String} (optional) commandDesc.shortcut - keyboard shortcut for the command
     * @param  {Bool} (optional) commandDesc.allowHotkeyInForms - whether to enable keyboard shortcut in form elements
     */
    addCommand(commandDesc) {
      this.commands.push(commandDesc);
    }

    $get() {
      return this;
    }
  }

  angular.module('editorApp')
    .provider('CommandPaletteCfg', CommandPaletteCfg);
})();
