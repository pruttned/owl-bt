'use strict';

angular.module('editorApp')
  .directive('numberPropertyEditor', function ($compile, _) {
    return {
      template: '<div></div>',
      restrict: 'EA',
      replace: true,
      scope: {
        property: '=',
      },
      link: function (scope, element) {
        let editorElm = angular.element('<form-group-param-editor property="property"><input type="number" class="form-control" ng-model="property.value" ng-model-options="{ getterSetter: true, updateOn: \'blur\', allowInvalid:true }"></input></form-group-param-editor>');
        let inputElm = editorElm.find('input');
        if (scope.property) {
          let desc = scope.property.desc;
          if (!_.isNil(desc.min)) {
            inputElm.attr('min', desc.min);
          }
          if (!_.isNil(desc.max)) {
            inputElm.attr('max', desc.max);
          }
        }
        element.append(editorElm);
        $compile(editorElm)(scope);
      }
    };
  });