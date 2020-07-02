(function () {
  'use strict';

  angular.module('editorApp')
    .directive('treeItemDetails', function (TreeSelection) {
      return {
        template: require('./treeItemDetails.html'),
        restrict: 'E',
        replace: true,
        scope: {},

        link: function (scope, element) {
          scope.TreeSelection = TreeSelection;
          
          scope.hasSelectedItem = () => {
            return TreeSelection.selItem();
          };
          scope.selIsDecorator = () => {
            return TreeSelection.selItemType() === 'decorator';
          };
          scope.selIsService = () => {
            return TreeSelection.selItemType() === 'service';
          };
          scope.isInvalidDesc = () => {
            const selItem = TreeSelection.selItem();
            return selItem && selItem.$meta.desc.isInvalid;
          };
        }
      };
    });
})();
