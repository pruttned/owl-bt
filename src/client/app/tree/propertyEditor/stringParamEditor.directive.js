(function () {
  'use strict';

  angular.module('editorApp')
    .directive('stringPropertyEditor', function ($compile) {
      return {
        template: '<div></div>',
        restrict: 'EA',
        replace: true,
        scope: {
          property: '=',
        },
        link: function (scope, element) {
          let editorElm = angular.element('<div><form-group-param-editor property="property"><input class="form-control" ng-model="property.value" ng-model-options="{ getterSetter: true, updateOn: \'blur\' }"></input></form-group-param-editor></div>');
          let inputElm = editorElm.find('input');
          element.append(editorElm);
          $compile(editorElm)(scope);
        }
      };
    });
})();
