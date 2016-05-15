'use strict';

(function() {

  class ProjectStore {
    constructor($q) {
      this._$q = $q;
    }

    getNodeTypeDesc(type) {
      return this._$q.when(type);
    }

    getDecoratorTypeDesc(type) {
      return this._$q.when(type);
    }
    getServiceTypeDesc(type) {
      return this._$q.when(type);
    }
  }

  angular.module('mocks.ProjectStore', [])
    .service('ProjectStore', ProjectStore);
})();
