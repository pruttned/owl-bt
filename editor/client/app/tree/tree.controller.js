'use strict';

angular.module('editorApp')
  .controller('TreeCtrl', function($scope, $interpolate, hotkeys, ListSelectDialog,
    ProjectModel, TreeModel, UndoRedoManager) {

    //https://github.com/angular/angular.js/wiki/Understanding-Scopes#ng-include
    $scope.model = {
      tree: TreeModel,
      commands: [{
          name: 'add.node',
          icon: 'cog',
          action: function() {}
        }, {
          name: 'add.decorator',
          icon: 'cog',
          action: function() {}
        }, {
          name: 'add.service',
          icon: 'cog',
          action: function() {}
        }, {
          name: 'move.up',
          icon: 'cog',
          action: function() {}
        }, {
          name: 'move.down',
          icon: 'cog',
          action: function() {}
        }, {
          name: 'delete',
          icon: 'cog',
          action: function() {}
        }]
        // commands : {
        //   add:{
        //     forComposite: [],
        //     forLeaf: []
        //   }
        // }
    };

    // function buildCommands() {
    //   let forCompositeAddCommands = $scope.model.commands.add.forComposite;
    //   let forLeafAddCommands = $scope.model.commands.add.forLeaf;
    //
    //   for (let nodeTypeName in ProjectModel.nodeTypes) {
    //     if (ProjectModel.nodeTypes.hasOwnProperty(nodeTypeName)) {
    //       let nodeType = ProjectModel.nodeTypes[nodeTypeName];
    //       commands.push({
    //         name: 'add.node.' + nodeType.name,
    //         icon: nodeType.icon,
    //         action: addNodeCommand
    //       });
    //     }
    //   }
    //   return commands;
    // }


    $scope.getNodeItemActions = function(/*nodeItem*/) {
      return [
        {
          title: 'item1',
          icon: 'cog',
          action: function(nodeItem){
            console.log('item1 ' + nodeItem);
          }
        },
        {
          title: 'item2',
          action: function(nodeItem){
            console.log('item2 ' + nodeItem);
          }
        }
      ];
    };

    $scope.open = function() {
      ListSelectDialog.open($scope.model.commands)
        .result.then(function(item) {
          if (item.name === 'add.node') {
            ListSelectDialog.open([{
                name: 'node1',
                icon: 'cog',
                action: function() {}
              }, {
                name: 'node2',
                icon: 'cog',
                action: function() {}
              }])
              .result.then(function(item) {
                console.log('selected item = ' + item.name);
              }, function() {
                console.log('cancel');
              });
          }
          //console.log('selected item = ' + item.name);
        }, function() {
          console.log('cancel');
        });
    };
    $scope.undo = function() {
      UndoRedoManager.undo();
    };
    $scope.redo = function() {
      UndoRedoManager.redo();
    };

    hotkeys.add({
      combo: 'up',
      description: 'This one goes to 11',
      callback: function() {
        console.log('root up');
      }
    });


  });
