(function () {
  'use strict';

  angular.module('editorApp')
    .directive('treeItemPalette', function (TreeSelection) {
      return {
        template: require('./treeItemPalette.html'),
        restrict: 'E',
        replace: true,
        scope: {},

        link: function (scope, element) {
          scope.$watch(() => TreeSelection.selNode(), function () {
            let selNode = TreeSelection.selNode();
            scope.hasSelectedNode = selNode;
            scope.selNodeIsComposite = selNode && selNode.$meta.desc.isComposite;
          });

          scope.compositeNodes = function (items) {
            return items.filter(item => item.isComposite);
          }
          scope.actionNodes = function (items) {
            return items.filter(item => !item.isComposite);
          }
        }
      };
    });
})();
