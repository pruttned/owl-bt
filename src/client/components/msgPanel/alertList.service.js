'use strict';

(function () {

  class AlertList {

    constructor(_, $timeout) {
      this.alerts = [];
      this._ = _;
      this._$timeout = $timeout;
    }

    addErr(msg, options) {
      this._add(msg, 'danger', options);
    }
    addInfo(msg, options) {
      this._add(msg, 'info', options);
    }
    addWarn(msg, options) {
      this._add(msg, 'warning', options);
    }

    _add(msg, level, { autoHide = false } = {}) {
      let alert = {
        level: level,
        message: msg
      };
      this.alerts.push(alert);
      if (autoHide) {
        this._$timeout(() => {
          let alertIndex = this.alerts.indexOf(alert);
          if (alertIndex >= 0) {
            this.remove(alertIndex);
          }
        }, 1000)
      }
    }

    remove(index) {
      this.alerts.splice(index, 1);
    }

    clear() {
      this.alerts = [];
    }
  }

  angular.module('editorApp')
    .service('AlertList', AlertList);


})();
