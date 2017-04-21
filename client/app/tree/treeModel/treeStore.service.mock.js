'use strict';

(function() {

  class TreeStore {
    constructor() {
      this.version = 1;
    }

    updateVersion() {
      if (this.version === Number.MAX_SAFE_INTEGER) {
        this.version = 1;
      } else {
        this.version++;
      }
    }
  }

  angular.module('mocks.TreeStore', [])
    .service('TreeStore', TreeStore);
})();
