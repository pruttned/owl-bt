'use strict';

angular.module('editorApp')
  .directive('enumPropertyEditor', function() {

    return {
      template: '<select ng-model="property.value" ng-model-options="{ getterSetter: true}" ng-options="option for option in property.desc.values"></select>',
      restrict: 'EA',
      replace: true,
      scope: {
        property: '=',
      },

      // link: function(scope, element) {
      //   scope.$watch('property', function() {
      //     element.empty();
      //     if (scope.property) {
      //       let values = scope.property.desc.values;
      //       if (values) {
      //         values.forEach(value => {
      //           let optionElm = angular.element('<option></option>');
      //           optionElm.val(value);
      //           optionElm.text(value);
      //           if (value === scope.property.value()) {
      //             optionElm.attr('selected', true);
      //           }
      //
      //           element.append(optionElm);
      //         });
      //       }
      //     }
      //   });
      // }
    };
  });
