'use strict';

angular.module('editorApp')
  .controller('TreeCtrl', function($scope, $interpolate, hotkeys, ListSelectDialog, ProjectModel, TreeModel, EditablePropertyProvider) {

    function buildCommands() {
      let addNodeCommand = function() {
        console.log(this.name);
      };
      let commands = [];
      for (let nodeTypeName in ProjectModel.nodeTypes) {
        if (ProjectModel.nodeTypes.hasOwnProperty(nodeTypeName)) {
          let nodeType = ProjectModel.nodeTypes[nodeTypeName];
          commands.push({
            name: 'add.node.' + nodeType.name,
            icon: nodeType.icon,
            action: addNodeCommand
          });
        }
      }
      return commands;
    }


    //https://github.com/angular/angular.js/wiki/Understanding-Scopes#ng-include
    $scope.model = {
      commands: buildCommands(),
      tree: TreeModel
    };


    $scope.$watch('model.selectedNodeItem', function() {
      $scope.model.selectedNodeItemProperties = EditablePropertyProvider.getEditableProperties($scope.model.selectedNodeItem);
    });


    $scope.open = function() {
      ListSelectDialog.open($scope.model.commands)
        .result.then(function(item) {
          console.log('selected item = ' + item.name);
        }, function() {
          console.log('cancel');
        });
    };

    hotkeys.add({
      combo: 'up',
      description: 'This one goes to 11',
      callback: function() {
        console.log('root up');
      }
    });


  });
