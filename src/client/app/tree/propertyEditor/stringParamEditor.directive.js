'use strict';

angular.module('editorApp')
  .directive('stringPropertyEditor', function() {
    return {
      template: '<input class="form-control" ng-model="property.value" ng-model-options="{ getterSetter: true, updateOn: \'blur\' }"></input>',
      restrict: 'EA',
      replace: true,
      scope: {
        property: '=',
      }
    };
  });
