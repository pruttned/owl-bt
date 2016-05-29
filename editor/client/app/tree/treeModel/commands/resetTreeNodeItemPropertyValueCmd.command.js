'use strict';

(function() {
  class ResetTreeNodeItemPropertyValueCmd {
    constructor(CommandExecutor, TreeStore, TreeNodeItemProperty, TreeNode) {
        this._CommandExecutor = CommandExecutor;
        this._TreeStore = TreeStore;
        this._TreeNodeItemProperty = TreeNodeItemProperty;
        this._TreeNode = TreeNode;
      }
      /**
       * @param  {object} params
       * @param  {node} params.node
       * @param  {Object} params.nodeItem - (optional) node item that owns the property. Null or node for node property
       * @param  {String} params.property - property that should be set
       */
    exec(params) {
      let _this = this;

      let nodeItem = params.nodeItem || params.node;
      let wasSet = this._TreeNodeItemProperty.isSet(nodeItem, params.property);
      let oldValue;
      if (wasSet) {
        oldValue = this._TreeNodeItemProperty.value(nodeItem, params.property);
      }

      this._CommandExecutor.exec({
        exec: () => {
          _this._TreeNodeItemProperty.reset(nodeItem, params.property);

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        },
        undo: () => {
          if (wasSet) {
            _this._TreeNodeItemProperty.value(nodeItem, params.property, oldValue);

            _this._TreeStore.updateVersion();
            _this._TreeNode.updateVersion(params.node);
          }
        }
      });
    }
  }

  angular.module('editorApp')
    .service('ResetTreeNodeItemPropertyValueCmd', ResetTreeNodeItemPropertyValueCmd);
})();
