'use strict';

angular.module('editorApp')
  .controller('TreeCtrl', function($scope, $interpolate, $location, hotkeys, ListSelectDialog,
    TreeStore, TreeSelection, CommandPalette, TreeNode,
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

    TreeStore.load()
      .then(() => {
        this.rootNode = TreeStore.rootNode;
      });
  });
