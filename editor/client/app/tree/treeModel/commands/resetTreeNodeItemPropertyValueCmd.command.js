'use strict';

(function() {
  class ResetTreeNodeItemPropertyValueCmd {
    constructor(TreeStore, TreeNodeItemProperty, TreeNode) {
        this._treeStore = TreeStore;
        this._treeNodeItemProperty = TreeNodeItemProperty;
        this._treeNode = TreeNode;
      }
      /**
       * @param  {object} params
       * @param  {node} params.node
       * @param  {service/decorator} params.nodeItem - optional if property of node should be reset
       * @param  {String} params.property - property that should be set
       * @return {Object} cmd - command instance
       * @return {function} cmd.exec - function for executing the command
       * @return {function} cmd.undo - function for undoing the command
       */
    create(params) {
      let _this = this;

      let nodeItem = params.nodeItem || params.node;
      let wasSet = this._treeNodeItemProperty.isSet(nodeItem, params.property);
      let oldValue;
      if (wasSet) {
        oldValue = this._treeNodeItemProperty.value(nodeItem, params.property);
      }

      return {
        exec: () => {
          _this._treeNodeItemProperty.reset(nodeItem, params.property);

          _this._treeStore.updateVersion();
          _this._treeNode.updateVersion(params.node);
        },
        undo: () => {
          if (wasSet) {
            _this._treeNodeItemProperty.value(nodeItem, params.property, oldValue);

            _this._treeStore.updateVersion();
            _this._treeNode.updateVersion(params.node);
          }
        }
      };
    }
  }

  angular.module('editorApp')
    .service('ResetTreeNodeItemPropertyValueCmd', ResetTreeNodeItemPropertyValueCmd);
})();
