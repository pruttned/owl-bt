'use strict';

(function() {

  class AlertList {

    constructor() {
      this.alerts = [];
    }

    addErr(msg) {
      this.alerts.push({
        level: 'danger',
        message: msg
      });
    }
    addInfo(msg) {
      this.alerts.push({
        level: 'info',
        message: msg
      });
    }
    addWarn(msg) {
      this.alerts.push({
        level: 'warning',
        message: msg
      });
    }
    remove(index) {
      this.alerts.splice(index, 1);
    }
  }

  angular.module('editorApp')
    .service('AlertList', AlertList);


})();
