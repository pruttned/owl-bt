'use strict';

(function() {
  const focusNodeEventName = 'tree-focus-focus-node';

  /**
   * Enables views to subscribe for node focus requests.
   * View should move its displaying area to specified node on receiving this request
   */
  class TreeFocus {

    constructor($rootScope) {
      this._$rootScope = $rootScope;
    }

    /**
     * subscribe listener
     * @param  {scope}   scope
     * @param  {Function} callback - fun(node)
     */
    subscribe(scope, callback) {
      var handler = this._$rootScope.$on(focusNodeEventName, (e, n) => callback(n));
      scope.$on('$destroy', handler);
    }

    focusNode(node) {
      this._$rootScope.$emit(focusNodeEventName, node);
    }

  }

  angular.module('editorApp')
    .service('TreeFocus', TreeFocus);
})();
