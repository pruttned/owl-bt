'use strict';

angular.module('editorApp')
  .directive('propertyReset', function() {
    return {
      template: '<span class="fa fa-undo icon-button" ng-click="property.reset()" ng-if="property.isSet()"></span>',
      restrict: 'EA',
      replace: true,
      scope: {
        property: '=',
      }
    };
  });