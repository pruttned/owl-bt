'use strict';

(function() {

  class NodeItemAction {

    constructor($q, $injector, NodeItemActionCfg) {
      this._$injector = $injector;
      this._$q = $q;
      this._NodeItemActionCfg = NodeItemActionCfg;
    }

    getNodeContexMenuActions(node) {
      return this._getActions(node, this._NodeItemActionCfg.nodeContextMenuActions);
    }

    getServiceContexMenuActions(service) {
      return this._getActions(service, this._NodeItemActionCfg.serviceContextMenuActions);
    }

    getDecoratorContexMenuActions(decorator) {
      return this._getActions(decorator, this._NodeItemActionCfg.decoratorContextMenuActions);
    }

    _getActions(nodeItem, actionServices) {
      let actions = [];
      for (let actionSvcName of actionServices) {
        this._$injector.invoke([actionSvcName, actionSvc => {
          let action = actionSvc.create(nodeItem);
          if (action) {
            actions.push({
              title: action.title,
              icon: action.icon,
              action: () => {
                return this._$q.when(action.action());
              }
            });
          }
        }]);
      }
      return actions;
    }
  }

  angular.module('editorApp')
    .service('NodeItemAction', NodeItemAction);
})();
