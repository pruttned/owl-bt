'use strict';

(function() {
  class MoveTreeNodeCmd {
    constructor(CommandExecutor, TreeStore, TreeNode) {
        this._CommandExecutor = CommandExecutor;
        this._TreeStore = TreeStore;
        this._TreeNode = TreeNode;
      }
      /**
       * @param  {object} params
       * @param  {node} params.node - node that contains the specified child node
       * @param  {node} params.childNode - child node that should be moved
       * @param  {bool} params.left - whether to move child node left(true) or right(false)
       */
    exec(params) {
      let _this = this;

      this._CommandExecutor.exec({
        exec: () => {
          _this._TreeNode.moveChildNode(params.node, params.childNode, params.left);

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        },
        undo: () => {
          _this._TreeNode.moveChildNode(params.node, params.childNode, !params.left);

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        }
      });
    }
  }

  angular.module('editorApp')
    .service('MoveTreeNodeCmd', MoveTreeNodeCmd);
})();
