'use strict';

(function() {
  class MoveTreeNodeCmd {
    constructor(TreeStore, TreeNode) {
        this._TreeStore = TreeStore;
        this._TreeNode = TreeNode;
      }
      /**
       * @param  {object} params
       * @param  {node} params.node - node that contains the specified subItem
       * @param  {node} params.childNode - child node that should be moved
       * @param  {bool} params.left - whether to child node item left(true) or right(false)
       * @return {Object} cmd - command instance
       * @return {function} cmd.exec - function for executing the command
       * @return {function} cmd.undo - function for undoing the command
       */
    create(params) {
      let _this = this;

      return {
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
      };
    }
  }

  angular.module('editorApp')
    .service('MoveTreeNodeCmd', MoveTreeNodeCmd);
})();
