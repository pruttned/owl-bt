'use strict';

angular.module('editorApp')
  .controller('ProjectCtrl', function($scope, $stateParams, $state, ProjectTree, ProjectItemType) {

    function addWarnings(warnings) {
      Array.prototype.push.apply($scope.warnings, warnings);
    }

    function getProjectItemUrl(projectItem) {
      switch (projectItem.type) {
        case ProjectItemType.DIRECTORY:
          return $state.href($state.current, {
            dirPath: projectItem.path
          });
        case ProjectItemType.TREE:
          return 'TODO'; //TODO: remove this line and modify the route details below
          // return $state.href('tree', {
          //   path: projectItem.path
          // });
        default:
          throw new Error(`Project item type '${projectItem.type}' is not supported.`);
      }
    }

    function getProjectItemIconClass(projectItem) {
      switch (projectItem.type) {
        case ProjectItemType.DIRECTORY:
          return 'fa-folder-o';
        case ProjectItemType.TREE:
          return 'fa-sitemap';
        default:
          throw new Error(`Project item type '${projectItem.type}' is not supported.`);
      }
    }

    function createProjectItemViewModels(projectItems) {
      return projectItems.sort(projectItem => projectItem.type !== ProjectItemType.DIRECTORY)
        .map(projectItem => {
          return {
            name: projectItem.name,
            url: getProjectItemUrl(projectItem),
            iconClass: getProjectItemIconClass(projectItem)
          };
        });
    }

    function initProjectItems() {
      ProjectTree.getProjectItems($stateParams.dirPath)
        .then(result => { //success
          $scope.projectItems = createProjectItemViewModels(result.projectItems);
          addWarnings(result.warnings);
        }, error => { //error
          //TODO: redirect to error page; $state.go - http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.$state
          window.alert(error);
        });
    }

    $scope.dirPath = $stateParams.dirPath;
    $scope.warnings = [];
    initProjectItems();
  });
