'use strict';

angular.module('editorApp')
  .controller('TreeCtrl', function($scope, $interpolate, $location, hotkeys, ListSelectDialog,
    TreeStore, CommandExecutor) {
      let _this  = this;

      this.undo = function(){
        CommandExecutor.exec('UndoCmd');
      };
      this.redo = function(){
        CommandExecutor.exec('RedoCmd');
      };

      this.selectNodeItem = function(node, item){
        _this.selNode = node;
        _this.selItem = item;
      };
      this.selectNode = function(node){
        _this.selNode = node;
        _this.selItem = node;
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

    TreeStore.rootNode()
      .then(rootNode => {
        this.rootNode = rootNode;
        this.tmpFlatTree = tmpFlattenTree(rootNode);
      });

    $scope.$watch(() => this.selItem, function() {

    });
    //watch http://stackoverflow.com/questions/24078535/angularjs-controller-as-syntax-and-watch
  });
