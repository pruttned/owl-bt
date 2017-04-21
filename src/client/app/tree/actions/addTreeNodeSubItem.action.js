'use strict';

(function() {
  class AddTreeNodeSubItemAction {
    constructor(ActionExecutor, TreeStore, TreeNode) {
        this._ActionExecutor = ActionExecutor;
        this._TreeStore = TreeStore;
        this._TreeNode = TreeNode;
      }
      /**
       * @param  {object} params
       * @param  {node} params.node - node to which should be the item added
       * @param  {string} params.subItemType - 'service' or 'decorator'
       * @param  {service|decorator} params.subItem - sub item that should be added
       * @param  {int} params.index - (optional) target index. Item is added to the end if not provided
       */
    exec(params) {
      let _this = this;
      this._ActionExecutor.exec({
        exec: () => {
          _this._TreeNode.addSubItemAt(params.node, params.subItem, params.subItemType, params.index);

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        },
        undo: () => {
          _this._TreeNode.removeSubItem(params.node, params.subItem);

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        }
      });
    }
  }

  angular.module('editorApp')
    .service('AddTreeNodeSubItemAction', AddTreeNodeSubItemAction);
})();
