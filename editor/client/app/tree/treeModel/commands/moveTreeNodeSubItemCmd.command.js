'use strict';

(function() {
  class MoveTreeNodeSubItemCmd {
    constructor(TreeStore, TreeNode) {
        this._TreeStore = TreeStore;
        this._TreeNode = TreeNode;
      }
      /**
       * @param  {object} params
       * @param  {node} params.node - node that contains the specified subItem
       * @param  {service/decorator} params.subItem - sub item that should be moved
       * @param  {bool} params.up - whether to move sub item up(true) or down(false)
       * @return {Object} cmd - command instance
       * @return {function} cmd.exec - function for executing the command
       * @return {function} cmd.undo - function for undoing the command
       */
    create(params) {
      let _this = this;

      return {
        exec: () => {
          _this._TreeNode.moveSubItem(params.node, params.subItem, params.up);

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        },
        undo: () => {
          _this._TreeNode.moveSubItem(params.node, params.subItem, !params.up);

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        }
      };
    }
  }

  angular.module('editorApp')
    .service('MoveTreeNodeSubItemCmd', MoveTreeNodeSubItemCmd);
})();
