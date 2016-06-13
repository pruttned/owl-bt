'use strict';

(function() {

  class CommandContextMenu {
    constructor(_, $q, CommandContextMenuCfg, CommandPalette, ContextMenu) {
      this._ = _;
      this._ContextMenu = ContextMenu;
      this._CommandPalette = CommandPalette;

      this._menuItems = CommandContextMenuCfg.menuItems.map(menuItemDesc => {
        let command = CommandPalette.getCommand(menuItemDesc.command);
        if (!command) {
          throw new Error(`Missing command ${menuItemDesc.command}`);
        }
        return {
          title: menuItemDesc.title || command.name,
          icon: menuItemDesc.icon || command.icon,
          order: menuItemDesc.order || 0,
          command: menuItemDesc.command,
          action: () => $q.when(CommandPalette.exec(menuItemDesc.command))
        };
      });

      this.menuItems = _.sortBy(this._menuItems, 'order');
    }

    show(scope, event) {
      return this._ContextMenu.show(scope, event, this._getMenuItems());
    }

    hide() {
      this._ContextMenu.hide();
    }

    _getMenuItems() {
      return this._menuItems.filter(menuItem => this._CommandPalette.canExec(menuItem.command));
    }

  }

  angular.module('editorApp')
    .service('CommandContextMenu', CommandContextMenu);
})();
