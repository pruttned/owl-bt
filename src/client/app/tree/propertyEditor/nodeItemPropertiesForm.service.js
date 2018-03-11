(function () {
  'use strict';

  class NodeItemPropertiesForm {
    constructor() {
      this.form = null;
    }

    isValid() {
      return !this.form || this.form.$valid;
    }
  }

  angular.module('editorApp')
    .service('NodeItemPropertiesForm', NodeItemPropertiesForm);
})();
