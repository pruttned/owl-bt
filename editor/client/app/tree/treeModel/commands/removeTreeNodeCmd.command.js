'use strict';

(function() {
  class RemoveTreeNodeCmd {
    constructor(CommandExecutor, TreeStore, TreeNode) {
        this._CommandExecutor = CommandExecutor;
        this._TreeStore = TreeStore;
        this._TreeNode = TreeNode;
      }
      /**
       * @param  {object} params
       * @param  {node} params.node - node that contains the specified child node
       * @param  {node} params.childNode - node that should be removed
       */
    exec(params) {
      let _this = this;
      let index = _this._TreeNode.indexOfChildNode(params.node, params.childNode);
      this._CommandExecutor.exec({
        exec: () => {
          _this._TreeNode.removeChildNode(params.node, params.childNode);

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        },
        undo: () => {
          _this._TreeNode.addChildNodeAt(params.node, params.childNode, index);

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        }
      });
    }
  }

  angular.module('editorApp')
    .service('RemoveTreeNodeCmd', RemoveTreeNodeCmd);
})();
