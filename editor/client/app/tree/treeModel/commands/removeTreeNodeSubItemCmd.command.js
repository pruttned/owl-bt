'use strict';

(function() {
  class RemoveTreeNodeSubItemCmd {
    constructor(CommandExecutor, TreeStore, TreeNode) {
        this._CommandExecutor = CommandExecutor;
        this._TreeStore = TreeStore;
        this._TreeNode = TreeNode;
      }
      /**
       * @param  {object} params
       * @param  {node} params.node - node that contains the specified subItem
       * @param  {service|decorator} params.subItem - sub item that should be removed
       */
    exec(params) {
      let _this = this;
      let subItemType = _this._TreeNode.getSubItemType(params.node, params.subItem);
      let index = _this._TreeNode.indexOfSubItem(params.node, params.subItem);
      this._CommandExecutor.exec({
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
      });
    }
  }

  angular.module('editorApp')
    .service('RemoveTreeNodeSubItemCmd', RemoveTreeNodeSubItemCmd);
})();
