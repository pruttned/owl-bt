'use strict';

(function() {

  class AddTreeNodeItemCommand {

    constructor(_, AddTreeNodeAction, AddTreeNodeSubItemAction, ListSelectDialog, ProjectStore, TreeStore, TreeSelection, TreeNodeProvider, TreeServiceItemProvider, TreeDecoratorItemProvider,
      $rootScope) {
      this._ = _;
      this._AddTreeNodeAction = AddTreeNodeAction;
      this._AddTreeNodeSubItemAction = AddTreeNodeSubItemAction;
      this._ListSelectDialog = ListSelectDialog;
      this._ProjectStore = ProjectStore;
      this._TreeStore = TreeStore;
      this._TreeSelection = TreeSelection;

      this._ItemProviders = {
        'node': TreeNodeProvider,
        'service': TreeServiceItemProvider,
        'decorator': TreeDecoratorItemProvider
      };

      $rootScope.$watch(() => ProjectStore.version, () => this._handlePrjReload());
    }

    canExec() {
      return this._TreeSelection.hasSelected();
    }

    exec() {
      if (this.canExec()) {
        //TODO: update on ProjectStore change
        this._ensureDescItems(); //not in ctor because ProjectStore load

        let _this = this;
        let selNode = this._TreeSelection.selNode();

        this._openDlg = this._ListSelectDialog.open(selNode.$meta.desc.isComposite ? this._descItemsForCompositeNode : this._descItemsForLeefNode);
        return this._openDlg.result
          .then(descItem => {
            this._openDlg = null;
            if (descItem) {
              let nodeItem = _this._ItemProviders[descItem.itemType].create({
                type: descItem.desc.name
              });

              if (descItem.itemType === 'node') {
                return _this._AddTreeNodeAction.exec({
                  node: selNode,
                  childNode: nodeItem
                });
              } else {
                return _this._AddTreeNodeSubItemAction.exec({
                  node: selNode,
                  subItem: nodeItem,
                  subItemType: descItem.itemType
                });
              }
            }
          });
      }
    }

    _ensureDescItems() {
      if (!this._descItemsForLeefNode) {
        let subItemDescsItems = this._.values(this._ProjectStore.getServiceDescs()).map(d => ({
          name: 'svc:' + d.name,
          icon: d.icon,
          desc: d,
          itemType: 'service'
        }));
        this._.values(this._ProjectStore.getDecoratorDescs()).forEach(d => subItemDescsItems.push({
          name: 'dec:' + d.name,
          icon: d.icon,
          desc: d,
          itemType: 'decorator'
        }));

        let nodeDescsItems = this._.values(this._ProjectStore.getNodeDescs()).map(d => ({
          name: 'node:' + d.name,
          icon: d.icon,
          desc: d,
          itemType: 'node'
        }));

        this._descItemsForCompositeNode = nodeDescsItems.concat(subItemDescsItems);
        this._descItemsForLeefNode = subItemDescsItems;

        this._descItemsForCompositeNode = this._.sortBy(this._descItemsForCompositeNode, 'name');
        this._descItemsForLeefNode = this._.sortBy(this._descItemsForLeefNode, 'name');
      }
    }

    _handlePrjReload() {
      if (this._openDlg) {
        this._openDlg.close();
        this._openDlg = null;
      }

      this._descItemsForCompositeNode = null;
      this._descItemsForLeefNode = null;
    }
  }

  angular.module('editorApp')
    .service('AddTreeNodeItemCommand', AddTreeNodeItemCommand)
    .config(function(CommandPaletteCfgProvider, CommandContextMenuCfgProvider) {
      CommandPaletteCfgProvider.addCommand({
        service: 'AddTreeNodeItemCommand',
        name: 'core:Add',
        icon: 'plus',
        hotkey: 'ins'
      });

      CommandContextMenuCfgProvider.addMenuItem({
        title: 'Add',
        command: 'core:Add',
        order: 100
      });
    });
})();
