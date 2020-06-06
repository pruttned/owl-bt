'use strict';

angular.module('editorApp')
  .directive('formGroupParamEditor', function() {
    return {
      template: '<div class="form-group"><label>{{property.name()}}</label><property-reset property="property"></property-reset><ng-transclude></ng-transclude></div>',
      restrict: 'EA',
      replace: true,
      transclude: true,
      scope: {
        property: '=',
      }
    };
  });