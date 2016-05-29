'use strict';

(function() {

  class MoveTreeNodeSubItemContextMenuAction {

    constructor(TreeNodeByIdStore, TreeNode, CommandExecutor) {
      this._TreeNodeByIdStore = TreeNodeByIdStore;
      this._TreeNode = TreeNode;
      this._CommandExecutor = CommandExecutor;
    }

    create(subItem, actionDesc) {
      let node = this._TreeNodeByIdStore.getNode(subItem.$meta.nodeId);
      if (this._TreeNode.canMoveSubItem(node, subItem, actionDesc.up)) {
        return {
          title: actionDesc.title,
          icon: actionDesc.icon,
          order: actionDesc.order,
          action: () => {
            return this._CommandExecutor.exec('MoveTreeNodeSubItemCmd', {
              node: node,
              subItem: subItem,
              up: actionDesc.up
            });
          }
        };
      }
    }
  }

  angular.module('editorApp')
    .service('MoveTreeNodeSubItemContextMenuAction', MoveTreeNodeSubItemContextMenuAction)
    .config(function(NodeItemActionCfgProvider) {
      NodeItemActionCfgProvider.registerServiceContextMenuAction({
        service: 'MoveTreeNodeSubItemContextMenuAction',
        title: 'Move Up',
        icon: 'arrow-up',
        up: true,
        order: 100
      });
      NodeItemActionCfgProvider.registerServiceContextMenuAction({
        service: 'MoveTreeNodeSubItemContextMenuAction',
        title: 'Move Down',
        icon: 'arrow-down',
        up: false,
        order: 101
      });
      NodeItemActionCfgProvider.registerDecoratorContextMenuAction({
        service: 'MoveTreeNodeSubItemContextMenuAction',
        title: 'Move Up',
        icon: 'arrow-up',
        up: true,
        order: 100
      });
      NodeItemActionCfgProvider.registerDecoratorContextMenuAction({
        service: 'MoveTreeNodeSubItemContextMenuAction',
        title: 'Move Down',
        icon: 'arrow-down',
        up: false,
        order: 101
      });
    });
})();
