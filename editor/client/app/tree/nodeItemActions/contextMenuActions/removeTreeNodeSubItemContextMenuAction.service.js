'use strict';

(function() {

  class RemoveTreeNodeSubItemContextMenuAction {

    constructor(TreeNodeByIdStore, RemoveTreeNodeSubItemAction) {
      this._TreeNodeByIdStore = TreeNodeByIdStore;
      this._RemoveTreeNodeSubItemAction = RemoveTreeNodeSubItemAction;
    }

    create(subItem, actionDesc) {
      let node = this._TreeNodeByIdStore.getNode(subItem.$meta.nodeId);
      return {
        title: actionDesc.title,
        icon: actionDesc.icon,
        order: actionDesc.order,
        action: () => {
          return this._RemoveTreeNodeSubItemAction.exec({
            node: node,
            subItem: subItem
          });
        }
      };
    }
  }

  angular.module('editorApp')
    .service('RemoveTreeNodeSubItemContextMenuAction', RemoveTreeNodeSubItemContextMenuAction)
    .config(function(NodeItemActionCfgProvider) {
      NodeItemActionCfgProvider.registerServiceContextMenuAction({
        service: 'RemoveTreeNodeSubItemContextMenuAction',
        title: 'Remove',
        icon: 'remove',
        order: 200
      });
      NodeItemActionCfgProvider.registerDecoratorContextMenuAction({
        service: 'RemoveTreeNodeSubItemContextMenuAction',
        title: 'Remove',
        icon: 'remove',
        order: 200
      });
    });
})();
