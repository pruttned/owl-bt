(function () {
  'use strict';

  class AddTreeNodeItemAction {
    constructor(ActionExecutor, TreeStore, TreeNode) {
      this._ActionExecutor = ActionExecutor;
      this._TreeStore = TreeStore;
      this._TreeNode = TreeNode;
    }
    /**
     * @param  {object} params
     * @param  {node} params.node - node to which should be the item added
     * @param  {node} params.item - item that should be added
     * @param  {string} params.itemType - 'service' or 'decorator' or 'node'
     * @param  {int} params.index - (optional) target index. Item is added to the end if not provided
   */
    exec(params) {
      let _this = this;
      this._ActionExecutor.exec({
        exec: () => {
          if (params.itemType === 'node') {
            _this._TreeNode.addChildNodeAt(params.node, params.item, params.index);
          } else {
            _this._TreeNode.addSubItemAt(params.node, params.item, params.itemType, params.index);
          }
          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        },
        undo: () => {
          if (params.itemType === 'node') {
            _this._TreeNode.removeChildNode(params.node, params.item);
          } else {
            _this._TreeNode.removeSubItem(params.node, params.item);
          }

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        }
      });
    }
  }

  angular.module('editorApp')
    .service('AddTreeNodeItemAction', AddTreeNodeItemAction);
})();
