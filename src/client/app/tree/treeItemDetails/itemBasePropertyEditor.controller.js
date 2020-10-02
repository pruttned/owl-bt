'use strict';
(function () {

  function ItemBasePropertyEditorCtrl(TreeSelection, SetTreeNodeItemBasePropertyValueAction) {

    function propertyAccessor(property, isSet, value) {
      let item = TreeSelection.selItem();
      if (item) {
        if (isSet) {
          SetTreeNodeItemBasePropertyValueAction.exec({
            node: TreeSelection.selNode(),
            nodeItem: item,
            property: property,
            value: value,
          });
        } else {
          return item[property];
        }
      }
    }

    this.comment = function (value) {
      return propertyAccessor('comment', arguments.length, value);
    };
    this.label = function (value) {
      return propertyAccessor('label', arguments.length, value);
    };
  }

  angular.module('editorApp')
    .controller('ItemBasePropertyEditorCtrl', ItemBasePropertyEditorCtrl)
})();