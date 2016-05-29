'use strict';

(function() {

  class NodeItemAction {

    constructor($q, $injector, NodeItemActionCfg) {
      this._$injector = $injector;
      this._$q = $q;
      this._NodeItemActionCfg = NodeItemActionCfg;
    }

    getNodeContextMenuActions(node) {
      return this._getActions(node, this._NodeItemActionCfg.nodeContextMenuActions);
    }

    getServiceContextMenuActions(service) {
      return this._getActions(service, this._NodeItemActionCfg.serviceContextMenuActions);
    }

    getDecoratorContextMenuActions(decorator) {
      return this._getActions(decorator, this._NodeItemActionCfg.decoratorContextMenuActions);
    }

    _getActions(nodeItem, actionDescs) {
      let actions = [];
      for (let actionDesc of actionDescs) {
        this._$injector.invoke([actionDesc.service, actionSvc => {
          let action = actionSvc.create(nodeItem, actionDesc);
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
