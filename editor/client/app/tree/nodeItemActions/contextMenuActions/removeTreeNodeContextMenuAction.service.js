'use strict';

(function() {

  class RemoveTreeNodeContextMenuAction {

    constructor(TreeNodeByIdStore, TreeNode, RemoveTreeNodeCmd) {
      this._TreeNodeByIdStore = TreeNodeByIdStore;
      this._TreeNode = TreeNode;
      this._RemoveTreeNodeCmd = RemoveTreeNodeCmd;
    }

    create(node, actionDesc) {
      if (node.$meta.parentId) {
        let parentNode = this._TreeNodeByIdStore.getNode(node.$meta.parentId);
        return {
          title: actionDesc.title,
          icon: actionDesc.icon,
          order: actionDesc.order,
          action: () => {
            return this._RemoveTreeNodeCmd.exec({
              node: parentNode,
              childNode: node,
            });
          }
        };
      }
    }
  }

  angular.module('editorApp')
    .service('RemoveTreeNodeContextMenuAction', RemoveTreeNodeContextMenuAction)
    .config(function(NodeItemActionCfgProvider) {
      NodeItemActionCfgProvider.registerNodeContextMenuAction({
        service: 'RemoveTreeNodeContextMenuAction',
        title: 'Remove',
        icon: 'remove',
        order: 200
      });
    });
})();
