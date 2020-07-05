'use strict';
(function () {

  function ServiceBasePropertyEditorCtrl(TreeSelection, SetTreeNodeItemBasePropertyValueAction) {

    function selIsService() {
      return TreeSelection.selItemType() === 'service';
    }

    function propertyAccessor(property, isSet, value) {
      if (selIsService()) {
        let dec = TreeSelection.selItem();
        if (isSet) {
          SetTreeNodeItemBasePropertyValueAction.exec({
            node: TreeSelection.selNode(),
            nodeItem: dec,
            property: property,
            value: value,
          });
        } else {
          return dec[property];
        }
      }
    }

    this.timeBetweenTicks = function (value) {
      return propertyAccessor('timeBetweenTicks', arguments.length, value);
    };
    this.firstTickTime = function (value) {
      return propertyAccessor('firstTickTime', arguments.length, value);
    };
  }

  angular.module('editorApp')
    .controller('ServiceBasePropertyEditorCtrl', ServiceBasePropertyEditorCtrl)
})();