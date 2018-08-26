(function () {
  'use strict';

  angular.module('editorApp')
    .directive('customPropertyEditor', function ($compile, ProjectStore) {
      return {
        template: '<div></div>',
        restrict: 'EA',
        replace: true,
        scope: {
          property: '=',
          type: '@'
        },
        link: function (scope, element) {
          let customTypeDesc = ProjectStore.getCustomType(scope.type);
          scope.editorInputType = customTypeDesc.type === 'number' ? 'number' : 'text'; //TODO: other types
          let editorElm = angular.element('<div><form-group-param-editor property="property"><input type="{{editorInputType}}" class="form-control" ng-model="property.value" ng-model-options="{ getterSetter: true, updateOn: \'blur\', allowInvalid:true}"></input></form-group-param-editor></div>');
          let inputElm = editorElm.find('input');
          if (customTypeDesc.pattern) {
            inputElm.attr('pattern', customTypeDesc.pattern);
          }
          element.append(editorElm);
          $compile(editorElm)(scope);
        }
      };
    });
})();
