'use strict';

angular.module('editorApp')
  .controller('TreeCtrl', function ($scope, $interpolate, $location, hotkeys, ListSelectDialog,
    TreeMruList, TreeStore, TreeSelection, TreeNode, UndoRedoManager, AlertList) {

    this.TreeSelection = TreeSelection;
    this.path = $location.search().path;

    this.selIsDecorator = function () {
      return TreeSelection.selItemType() === 'decorator';
    };
    this.selIsService = function () {
      return TreeSelection.selItemType() === 'service';
    };
    
    //TODO: extract
    AlertList.clear();
    UndoRedoManager.clear();
    TreeSelection.select();
    TreeStore.load(this.path)
      .then(() => {
        TreeMruList.register(TreeStore.treePath);
        this.rootNode = TreeStore.rootNode;
      })
      .catch((err) => {
        AlertList.addErr(`Failed to load tree. Error = '${err.data}'`);
      });
  });
