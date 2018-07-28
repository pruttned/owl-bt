'use strict';

(function() {

  function alertExceptionHandler($delegate, $injector) {
    let alertList;

    return function(exception, cause) {
      alertList = alertList || $injector.get('AlertList');
      alertList.addErr(exception.stack || exception.message || exception);
      $delegate(exception, cause);
    };
  }

  angular.module('editorApp')
    .config(['$provide', function($provide) {
      $provide.decorator('$exceptionHandler', alertExceptionHandler);
    }]);
})();