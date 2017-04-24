'use strict';

angular.module('editorApp')
  .directive('stringPropertyEditor', function() {
    return {
      template: '<div><form-group-param-editor property="property"><input class="form-control" ng-model="property.value" ng-model-options="{ getterSetter: true, updateOn: \'blur\' }"></input></form-group-param-editor></div>',
      restrict: 'EA',
      replace: true,
      scope: {
        property: '=',
      }
    };
  });