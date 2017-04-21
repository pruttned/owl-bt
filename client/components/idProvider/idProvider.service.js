'use strict';

(function() {

  /**
   * Provides unique integer ids
   */
  class IdProvider {
    constructor(){
      this._nextId = 1;
    }
    newId() {
      if (this._nextId === Number.MAX_SAFE_INTEGER) {
        throw new Error('max id reached');
      }
      return this._nextId++;
    }
  }

  angular.module('editorApp')
    .service('IdProvider', IdProvider);
})();
