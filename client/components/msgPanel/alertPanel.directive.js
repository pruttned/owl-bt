'use strict';

(function() {

  function alertPanel() {
    return {
      templateUrl: 'components/msgPanel/msgPanel.html',
      restrict: 'EA',
      replace: true,
      controller : function(AlertList){
        this.alerts = AlertList.alerts;

        this.closeAlert = function(index){
          AlertList.remove(index);
        };
      },
      controllerAs: 'alertPanel',
    };
  }

  angular.module('editorApp')
    .directive('alertPanel', alertPanel);
})();
