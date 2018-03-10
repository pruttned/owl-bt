(function () {
  'use strict';
  angular.module('editorApp')
    .directive('sidePanel', function () {
      return {
        templateUrl: 'components/sidePanel/sidePanel.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
          title: '@'
        },
      };
    });
})();
