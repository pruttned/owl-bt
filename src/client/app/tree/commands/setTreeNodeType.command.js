'use strict';

(function () {

  class SetTreeNodeTypeCommand {

    constructor(_, SetTreeNodeTypeAction, ListSelectDialog, ProjectStore, TreeStore, TreeSelection, TreeNodeProvider, $rootScope) {
      this._ = _;
      this._SetTreeNodeTypeAction = SetTreeNodeTypeAction;
      this._ListSelectDialog = ListSelectDialog;
      this._ProjectStore = ProjectStore;
      this._TreeStore = TreeStore;
      this._TreeSelection = TreeSelection;

      this._TreeNodeProvider = TreeNodeProvider;;

      $rootScope.$watch(() => ProjectStore.version, () => this._handlePrjReload());
    }

    canExec() {
      return this._TreeSelection.hasSelected() && this._TreeSelection.selItemType() === 'node';
    }

    exec() {
      if (this.canExec()) {
        this._ensureDescItems(); //not in ctor because ProjectStore load

        let _this = this;
        let selNode = this._TreeSelection.selNode();

        this._openDlg = this._ListSelectDialog.open(this._nodeDescsItems.filter(d => d.desc.isComposite === selNode.$meta.desc.isComposite && d.desc.name !== selNode.type));
        return this._openDlg.result
          .then(descItem => {
            this._openDlg = null;
            if (descItem) {
              // let nodeItem = _this._ItemProviders[descItem.itemType].create({
              //   type: descItem.desc.name
              // });
              return _this._SetTreeNodeTypeAction.exec({
                node: selNode,
                desc: descItem.desc
              });
            }
          });
      }
    }

    _ensureDescItems() {
      if (!this._nodeDescsItems) {
        this._nodeDescsItems = this._.values(this._ProjectStore.getNodeDescs()).map(d => ({
          name: 'node:' + d.name,
          icon: d.icon,
          desc: d,
          color: d.color || (d.isComposite ? '#d08038' : '#955cc6')
        }));
      }
    }

    _handlePrjReload() {
      if (this._openDlg) {
        this._openDlg.close();
        this._openDlg = null;
      }

      this._nodeDescsItems = null;
      this._nodeDescsItems = null;
    }
  }

  angular.module('editorApp')
    .service('SetTreeNodeTypeCommand', SetTreeNodeTypeCommand)
    .config(function (CommandPaletteCfgProvider, CommandContextMenuCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'SetTreeNodeTypeCommand',
        name: 'core:Set Node Type',
        icon: 'arrows-alt-h',
      });

      CommandContextMenuCfgProvider.addMenuItem({
        title: 'Set Node Type',
        command: 'core:Set Node Type',
        order: 300
      });
    });
})();
