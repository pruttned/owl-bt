'use strict';

(function() {

  class NodeItemActionCfg {

    constructor() {
      this.serviceContextMenuActions = [];
      this.decoratorContextMenuActions = [];
      this.nodeContextMenuActions = [];
    }

    registerServiceContextMenuAction(action) {
      this.serviceContextMenuActions.push(action);
    }
    registerDecoratorContextMenuAction(action) {
      this.decoratorContextMenuActions.push(action);
    }
    registerNodeContexMenuAction(action) {
      this.nodeContextMenuActions.push(action);
    }

    $get() {
      return this;
    }
  }

  angular.module('editorApp')
    .provider('NodeItemActionCfg', NodeItemActionCfg);
})();
