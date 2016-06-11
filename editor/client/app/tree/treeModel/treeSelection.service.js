'use strict';



(function() {

  class TreeSelection {
    constructor() {
      this.selNode = null;
      this.selItem = null;
      this.selItemType = null;
    }
  }

  angular.module('editorApp')
    .service('TreeSelection', TreeSelection);
})();
