'use strict';

(function() {
  /**
   * Used for setting base properties of node items. Like 'inverseCheckCondition' in decorator
   */
  class SetTreeNodeItemBasePropertyValueAction {
    constructor(ActionExecutor, TreeStore, TreeNodeItemProperty, TreeNode) {
        this._ActionExecutor = ActionExecutor;
        this._TreeStore = TreeStore;
        this._TreeNode = TreeNode;
      }
      /**
       * @param  {object} params
       * @param  {node} params.node
       * @param  {Object} params.nodeItem - (optional) node item that owns the property. Null or node for node property
       * @param  {String} params.property - property that should be set
       * @param  {Object} params.value - new value of the property
       */
    exec(params) {
      let _this = this;

      let nodeItem = params.nodeItem || params.node;
      let oldValue = nodeItem[params.property];

      this._ActionExecutor.exec({
        exec: () => {
          nodeItem[params.property] = params.value;

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        },
        undo: () => {
          nodeItem[params.property] = oldValue;

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        }
      });
    }
  }

  angular.module('editorApp')
    .service('SetTreeNodeItemBasePropertyValueAction', SetTreeNodeItemBasePropertyValueAction);
})();
