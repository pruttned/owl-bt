'use strict';

angular.module('editorApp')
  .controller('TreeCtrl', function($scope, $interpolate, $location, hotkeys, ListSelectDialog,
    TreeStore, TreeSelection, CommandPalette,
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



    TreeStore.load()
      .then(() => {
        this.rootNode = TreeStore.rootNode;
      });
  });
