'use strict';

angular.module('editorApp')
  .controller('TreeCtrl', function($scope, $interpolate, $location, hotkeys, ListSelectDialog,
    TreeMruList, TreeStore, TreeSelection, CommandPalette, TreeNode, UndoRedoManager,
    UndoAction, RedoAction, SaveTreeAction) {

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

      this.selIsDecorator = function(){
        return TreeSelection.selItemType() === 'decorator';
      };

    UndoRedoManager.clear();
    TreeSelection.select();
    TreeStore.load($location.search().path)
      .then(() => {
        TreeMruList.register(TreeStore.treePath);
        this.rootNode = TreeStore.rootNode;
      });
  });
