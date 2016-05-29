'use strict';

(function() {
  class RemoveTreeNodeSubItemCmd {
    constructor(TreeStore, TreeNode) {
        this._TreeStore = TreeStore;
        this._TreeNode = TreeNode;
      }
      /**
       * @param  {object} params
       * @param  {node} params.node - node that contains the specified subItem
       * @param  {node} params.subItem - sub item that should be moved
       * @return {Object} cmd - command instance
       * @return {function} cmd.exec - function for executing the command
       * @return {function} cmd.undo - function for undoing the command
       */
    create(params) {
      let _this = this;
      let subItemType = _this._TreeNode.getSubItemType(params.node, params.subItem);
      let index = _this._TreeNode.indexOfSubItem(params.node, params.subItem);
      return {
        exec: () => {
          _this._TreeNode.removeSubItem(params.node, params.subItem);

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        },
        undo: () => {
          _this._TreeNode.addSubItemAt(params.node, params.subItem, subItemType, index);

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        }
      };
    }
  }

  angular.module('editorApp')
    .service('RemoveTreeNodeSubItemCmd', RemoveTreeNodeSubItemCmd);
})();
