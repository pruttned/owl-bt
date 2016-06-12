'use strict';

(function() {
  class RemoveTreeNodeAction {
    constructor(ActionExecutor, TreeStore, TreeSelection, TreeNode) {
        this._ActionExecutor = ActionExecutor;
        this._TreeStore = TreeStore;
        this._TreeSelection = TreeSelection;
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
      this._ActionExecutor.exec({
        exec: () => {
          _this._TreeNode.removeChildNode(params.node, params.childNode);

          if(this._TreeSelection.isSelected(params.childNode)){
            this._TreeSelection.select();
          }

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
    .service('RemoveTreeNodeAction', RemoveTreeNodeAction);
})();
