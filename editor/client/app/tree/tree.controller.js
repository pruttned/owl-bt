'use strict';

angular.module('editorApp')
  .controller('TreeCtrl', function($scope, $interpolate, $location, hotkeys, ListSelectDialog,
    TreeStore, TreeSelection, CommandPalette, UndoAction, RedoAction, SaveTreeAction) {

      this.TreeSelection = TreeSelection;

      this.undo = function(){
        UndoAction.exec();
      };
      this.redo = function(){
        RedoAction.exec();
      };
      this.save = function(){
        SaveTreeAction.exec();
      };

      this.showCommandPalette = function(){
        CommandPalette.show();
      };

    function tmpFlattenTree(node, outFlatTree) {
      outFlatTree = outFlatTree || [];
      outFlatTree.push(node);
      if (node.childNodes) {
        for (let i = 0; i < node.childNodes.length; i++) {
          tmpFlattenTree(node.childNodes[i], outFlatTree);
        }
      }
      return outFlatTree;
    }

    TreeStore.load()
      .then(() => {
        this.rootNode = TreeStore.rootNode;
        this.tmpFlatTree = tmpFlattenTree(TreeStore.rootNode);
      });
  });
