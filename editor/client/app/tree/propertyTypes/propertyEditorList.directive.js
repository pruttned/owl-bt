'use strict';

angular.module('editorApp')
  .directive('propertyEditorList', function($compile) {

    return {
      template: '<ul class="property-list"></ul>',
      restrict: 'EA',
      replace: true,
      scope: {
        properties: '=',
      },

      link: function(scope, element) {
        scope.$watch('properties', function(){
          element.empty();
          if(scope.properties){
            for (var i = 0; i < scope.properties.length; i++) {
              let propertyType = scope.properties[i].desc.type;
              let template = $compile(`<li class="property-editor"><h2>{{properties[${i}].name}}</h2><button ng-click="properties[${i}].reset()" ng-if="properties[${i}].isSet">reset</button><div ${propertyType}-property-editor property="properties[${i}]">Missing editor for <em>${propertyType}</em> property type</div></li>`);
              element.append(template(scope));
            }
          }
        });
      }
    };
  });
