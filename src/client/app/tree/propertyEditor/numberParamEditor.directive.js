'use strict';

angular.module('editorApp')
  .directive('numberPropertyEditor', function ($compile) {
    return {
      template: '<div></div>',
      restrict: 'EA',
      replace: true,
      scope: {
        property: '=',
      },
      link: function (scope, element) {
        let editorElm = angular.element('<form-group-param-editor property="property"><input type="number" class="form-control" ng-model="property.value" ng-model-options="{ getterSetter: true, updateOn: \'blur\' }"></input></form-group-param-editor>');
        let inputElm = editorElm.find('input');
        if (scope.property) {
          let desc = scope.property.desc;
          if (desc.min) {
            inputElm.attr('min', desc.min);
          }
          if (desc.max) {
            inputElm.attr('max', desc.max);
          }
          if(desc.pattern){
            inputElm.attr('pattern', desc.pattern);
          }
        }
        element.append(editorElm);
        $compile(editorElm)(scope);
      }
    };
  });