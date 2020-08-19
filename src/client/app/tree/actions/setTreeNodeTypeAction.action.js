'use strict';

(function () {
  /**
   * Used for setting base properties of node items. Like 'inverseCheckCondition' in decorator
   */
  class SetTreeNodeTypeAction {
    constructor(_, ActionExecutor, TreeStore, TreeNodeItemProperty, TreeNode) {
      this._ = _;
      this._ActionExecutor = ActionExecutor;
      this._TreeStore = TreeStore;
      this._TreeNode = TreeNode;
    }
    /**
     * @param  {object} params
     * @param  {node} params.node
     * @param  {Object} params.desc - new node descriptor
     */
    exec(params) {
      let _this = this;

      let oldDesc = params.node.$meta.desc;
      let oldProperties = params.node.properties;

      this._ActionExecutor.exec({
        exec: () => {
          params.node.$meta.desc = params.desc;
          params.node.type = params.desc.name;
          params.node.properties = this._.pickBy(oldProperties, (_, p) => params.desc.properties && params.desc.properties.find(dp => dp.name === p));

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        },
        undo: () => {
          params.node.$meta.desc = oldDesc;
          params.node.type = oldDesc.name;
          params.node.properties = oldProperties;

          _this._TreeStore.updateVersion();
          _this._TreeNode.updateVersion(params.node);
        }
      });
    }
  }

  angular.module('editorApp')
    .service('SetTreeNodeTypeAction', SetTreeNodeTypeAction);
})();
