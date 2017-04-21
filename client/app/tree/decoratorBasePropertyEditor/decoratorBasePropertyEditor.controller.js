'use strict';

(function() {
  angular.module('editorApp')
    .controller('DecoratorBasePropertyEditorCtrl', function(TreeSelection, SetTreeNodeItemBasePropertyValueAction) {

      function selIsDecorator() {
        return TreeSelection.selItemType() === 'decorator';
      }

      function propertyAccessor(property, isSet, value){
        if (selIsDecorator()) {
          let dec = TreeSelection.selItem();
          if (isSet) {
            SetTreeNodeItemBasePropertyValueAction.exec({
              node : TreeSelection.selNode(),
              nodeItem : dec,
              property : property,
              value : value,
            });
          } else {
            return dec[property] || false;
          }
        }
      }

      this.inverseCheckCondition = function(value) {
        return propertyAccessor('inverseCheckCondition', arguments.length, value);
      };
      this.periodic = function(value) {
        return propertyAccessor('periodic', arguments.length, value);
      };
    });
})();
