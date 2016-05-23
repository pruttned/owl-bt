'use strict';

(function() {
  class SetTreeNodeItemPropertyValueCmd {
    constructor(TreeStore, TreeNodeItemProperty, TreeNode) {
        this._TreeStore = TreeStore;
        this._TreeNodeItemProperty = TreeNodeItemProperty;
        this._TreeNode = TreeNode;
      }
      /**
       * @param  {object} params
       * @param  {node} params.node
       * @param  {service/decorator} params.nodeItem - optional if property of node should be set
       * @param  {String} params.property - property that should be set
       * @param  {Object} params.value - new value of the property
       * @return {Object} cmd - command instance
       * @return {function} cmd.exec - function for executing the command
       * @return {function} cmd.undo  - function for undoing the command
       */
    create(params) {
      let _this = this;

      let nodeItem = params.nodeItem || params.node;
      let wasSet = this._TreeNodeItemProperty.isSet(nodeItem, params.property);
      let oldValue;
      if (wasSet) {
        oldValue = this._TreeNodeItemProperty.value(nodeItem, params.property);
      }
      return {
        exec: () => {
          _this._TreeNodeItemProperty.value(nodeItem, params.property, params.value);

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        },
        undo: () => {
          if (wasSet) {
            _this._TreeNodeItemProperty.value(nodeItem, params.property, oldValue);
          } else {
            _this._TreeNodeItemProperty.reset(nodeItem, params.property);
          }
          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        }
      };
    }
  }

  angular.module('editorApp')
    .service('SetTreeNodeItemPropertyValueCmd', SetTreeNodeItemPropertyValueCmd);
})();
