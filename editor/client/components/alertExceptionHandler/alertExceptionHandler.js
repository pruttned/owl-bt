'use strict';

(function() {

  function alertExceptionHandler($delegate, AlertList) {
    return function(exception, cause) {
      AlertList.addErr(exception.stack || exception.message || exception);

      $delegate(exception, cause);
    };
  }

  angular.module('editorApp')
    .config(['$provide', function($provide) {
      $provide.decorator('$exceptionHandler', alertExceptionHandler);
    }]);
})();
