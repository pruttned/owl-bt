'use strict';

(function() {

  class AddTreeNodeSubItemContextMenuAction {

    constructor(_, AddTreeNodeSubItemAction, ListSelectDialog, ProjectStore, TreeServiceItemProvider, TreeDecoratorItemProvider) {
      this._ = _;
      this._AddTreeNodeSubItemAction = AddTreeNodeSubItemAction;
      this._ListSelectDialog = ListSelectDialog;
      this._ProjectStore = ProjectStore;
      this._TreeServiceItemProvider = TreeServiceItemProvider;
      this._TreeDecoratorItemProvider = TreeDecoratorItemProvider;
    }

    create(node, actionDesc) {
      let _this = this;

      return {
        title: actionDesc.title,
        icon: actionDesc.icon,
        order: actionDesc.order,
        action: () => {
          let descs = _this._.values(_this._ProjectStore.getSubItemDescs(actionDesc.subItemType));
          return _this._ListSelectDialog.open(descs)
            .result.then(desc => {
              let provider = actionDesc.subItemType === 'service' ? _this._TreeServiceItemProvider : _this._TreeDecoratorItemProvider;
              let subItem = provider.create({
                type: desc.name
              });
              return _this._AddTreeNodeSubItemAction.exec({
                node: node,
                subItem: subItem,
                subItemType: actionDesc.subItemType
              });
            });
        }
      };
    }
  }

  angular.module('editorApp')
    .service('AddTreeNodeSubItemContextMenuAction', AddTreeNodeSubItemContextMenuAction)
    .config(function(NodeItemActionCfgProvider) {
      NodeItemActionCfgProvider.registerNodeContextMenuAction({
        service: 'AddTreeNodeSubItemContextMenuAction',
        title: 'Add Service',
        icon: 'clock-o',
        order: 10,
        subItemType: 'service'
      });
      NodeItemActionCfgProvider.registerNodeContextMenuAction({
        service: 'AddTreeNodeSubItemContextMenuAction',
        title: 'Add Decorator',
        icon: 'filter',
        order: 11,
        subItemType: 'decorator'
      });
    });
})();
