'use strict';

(function() {

  class ProjectStore {
    constructor($q) {
      this._$q = $q;
    }

    getNodeTypeDesc(type) {
      return type;
    }

    getDecoratorTypeDesc(type) {
      return type;
    }
    getServiceTypeDesc(type) {
      return type;
    }
  }

  angular.module('mocks.ProjectStore', [])
    .service('ProjectStore', ProjectStore);
})();
