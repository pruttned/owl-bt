'use strict';

angular.module('editorApp')
  .directive('boolPropertyEditor', function() {
    return {
      template: '<div class="checkbox"><label><input type="checkbox" ng-model="property.value" ng-model-options="{ getterSetter: true, allowInvalid:true }"></input>{{property.name()}}</label><property-reset property="property"/></div>',
      restrict: 'EA',
      replace: true,
      scope: {
        property: '=',
      }
    };
  });