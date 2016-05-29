'use strict';

(function() {

  class NodeItemActionCfg {

    constructor() {
      this.serviceContextMenuActions = [];
      this.decoratorContextMenuActions = [];
      this.nodeContextMenuActions = [];
    }

    /**
     * register context menu action for services
     * @param  {Object} actionDesc
     * @param  {String} actionDesc.service - name of the service, that handles the specified action
     */
    registerServiceContextMenuAction(actionDesc) {
      this.serviceContextMenuActions.push(actionDesc);
    }
    /**
     * register context menu action for decorators
     * @param  {Object} actionDesc
     * @param  {String} actionDesc.service - name of the service, that handles the specified action
     */
    registerDecoratorContextMenuAction(actionDesc) {
      this.decoratorContextMenuActions.push(actionDesc);
    }
    /**
     * register context menu action for nodes
     * @param  {Object} actionDesc
     * @param  {String} actionDesc.service - name of the service, that handles the specified action
     */
    registerNodeContextMenuAction(actionDesc) {
      this.nodeContextMenuActions.push(actionDesc);
    }

    $get() {
      return this;
    }
  }

  angular.module('editorApp')
    .provider('NodeItemActionCfg', NodeItemActionCfg);
})();
