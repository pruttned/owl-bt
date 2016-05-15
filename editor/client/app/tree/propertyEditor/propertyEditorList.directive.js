'use strict';

angular.module('editorApp')
  .directive('propertyEditorList', function($compile, PropertyAccessorProvider) {

    return {
      template: '<ul class="property-list"></ul>',
      restrict: 'EA',
      replace: true,
      scope: {
        selItem: '=',
      },

      link: function(scope, element) {
        let childScope;
        scope.$watch('selItem', function() {
          if (childScope) { //no leaking watchers
            childScope.$destroy();
            element.empty();
          }
          childScope = scope.$new();

          let selItem = scope.selItem;
          if(selItem){
            childScope.properties = PropertyAccessorProvider.createPropertyAccessors(selItem);
            for (let i = 0; i < childScope.properties.length; i++) {
              let propertyType = childScope.properties[i].desc.type;
              let template = $compile(`<li class="property-editor"><label>{{properties[${i}].name()}}</label><span class="fa fa-undo icon-button" ng-click="properties[${i}].reset()" ng-if="properties[${i}].isSet()"></span><div ${propertyType}-property-editor property="properties[${i}]">Missing editor for <em>${propertyType}</em> property type</div></li>`);
              element.append(template(childScope));
            }
          }
        });
      }
    };
  });
