'use strict';

(function() {

  class CommandTopMenuCfg {

    constructor() {
      this.menuItems = [];
    }

    /**
     * register context menu action for services
     * @param  {Object} itemDesc
     * @param  {String} itemDesc.command - name of the command in command palette, that handles the specified menu action
     * @param  {String} itemDesc.title - (optional) display title. Command name by default
     * @param  {String} itemDesc.section - (optional) root section in top menu. 'Cmds' by default
     * @param  {String} itemDesc.order - (optional) order (0=first) of the item in the menu. 0 by default
     */
    addMenuItem(itemDesc) {
      this.menuItems.push(itemDesc);
    }

    $get() {
      return this;
    }
  }

  angular.module('editorApp')
    .provider('CommandTopMenuCfg', CommandTopMenuCfg);
})();
