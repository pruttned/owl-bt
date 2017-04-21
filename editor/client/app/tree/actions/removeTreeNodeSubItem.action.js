'use strict';

(function() {
  class RemoveTreeNodeSubItemAction {
    constructor(ActionExecutor, TreeStore, TreeSelection, TreeNode) {
        this._ActionExecutor = ActionExecutor;
        this._TreeStore = TreeStore;
        this._TreeSelection = TreeSelection;
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
      this._ActionExecutor.exec({
        exec: () => {
          _this._TreeNode.removeSubItem(params.node, params.subItem);

          if(this._TreeSelection.isSelected(params.subItem)){
            this._TreeSelection.select();
          }

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
    .service('RemoveTreeNodeSubItemAction', RemoveTreeNodeSubItemAction);
})();
