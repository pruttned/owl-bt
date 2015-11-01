'use strict';

angular.module('editorApp')
  .controller('ProjectCtrl', function ($scope, $stateParams, ProjectTree) {
      $scope.projectItems = ProjectTree.getProjectItems($stateParams.path)                            
                            .sort(projectItem => !projectItem.isFolder)                            
                            .map(projectItem => {
                                return {
                                    name: projectItem.name,
                                    url: projectItem.isFolder ? `/project?path=${window.encodeURIComponent(projectItem.path)}` : 'TODO-tree-url',
                                    displayUrl: projectItem.isFolder ? `/project?path=${projectItem.path}` : 'TODO-tree-url',
                                    isFolder: projectItem.isFolder
                                };
                            });
  });
