'use strict';

angular.module('editorApp')
  .directive('enumPropertyEditor', function() {

    return {
      template: '<div><form-group-param-editor property="property"><select class="form-control" ng-model="property.value" ng-model-options="{ getterSetter: true, allowInvalid:true}" ng-options="option for option in property.desc.values"></select></form-group-param-editor></div>',
      restrict: 'EA',
      replace: true,
      scope: {
        property: '=',
      }
    };
  });
