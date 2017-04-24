'use strict';

(function () {
  function CommandTopMenuCtrl(_, $q, CommandTopMenuCfg, CommandPalette) {
    const baseItems = [
      {
        title: 'Command Palette',
        section: 'View',
        order: 600,
        hotkey: 'ctrl+shift+p',
        action: () => $q.when(CommandPalette.show())
      }
    ];

    this.sections = _.chain(CommandTopMenuCfg.menuItems)
      .map(menuItemDesc => {
        let command = CommandPalette.getCommand(menuItemDesc.command);
        if (!command) {
          throw new Error(`Missing command ${menuItemDesc.command}`);
        }
        return {
          title: menuItemDesc.title || command.name,
          section: menuItemDesc.section || 'Cmds',
          order: menuItemDesc.order || 0,
          hotkey: command.hotkeyStr,
          action: () => $q.when(CommandPalette.exec(menuItemDesc.command))
        };
      })
      .concat(baseItems)
      .sortBy('order')
      .groupBy('section')
      .map((items, section) => ({
        name: section,
        items: items
      }))
      .value();
  }

  angular.module('editorApp')
    .controller('CommandTopMenuCtrl', CommandTopMenuCtrl);
})();
