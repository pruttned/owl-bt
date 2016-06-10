'use strict';

(function() {

  class MoveTreeNodeContextMenuAction {

    constructor(TreeNodeByIdStore, TreeNode, MoveTreeNodeAction) {
      this._TreeNodeByIdStore = TreeNodeByIdStore;
      this._TreeNode = TreeNode;
      this._MoveTreeNodeAction = MoveTreeNodeAction;
    }

    create(node, actionDesc) {
      if (node.$meta.parentId) {
        let parentNode = this._TreeNodeByIdStore.getNode(node.$meta.parentId);
        if (this._TreeNode.canMoveChildNode(parentNode, node, actionDesc.left)) {
          return {
            title: actionDesc.title,
            icon: actionDesc.icon,
            order: actionDesc.order,
            action: () => {
              return this._MoveTreeNodeAction.exec({
                node: parentNode,
                childNode: node,
                left: actionDesc.left
              });
            }
          };
        }
      }
    }
  }

  angular.module('editorApp')
    .service('MoveTreeNodeContextMenuAction', MoveTreeNodeContextMenuAction)
    .config(function(NodeItemActionCfgProvider) {
      NodeItemActionCfgProvider.registerNodeContextMenuAction({
        service: 'MoveTreeNodeContextMenuAction',
        title: 'Move left',
        icon: 'arrow-left',
        left: true,
        order: 100
      });
      NodeItemActionCfgProvider.registerNodeContextMenuAction({
        service: 'MoveTreeNodeContextMenuAction',
        title: 'Move right',
        icon: 'arrow-right',
        left: false,
        order: 101
      });
    });
})();
