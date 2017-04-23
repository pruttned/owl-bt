'use strict';

angular.module('editorApp')
  .directive('boolPropertyEditor', function() {
    return {
      template: '<input class="form-control" type="checkbox" ng-model="property.value" ng-model-options="{ getterSetter: true }"></input>',
      restrict: 'EA',
      replace: true,
      scope: {
        property: '=',
      }
    };
  });
