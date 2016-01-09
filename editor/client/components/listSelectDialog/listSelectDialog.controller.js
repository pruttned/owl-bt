'use strict';

angular.module('editorApp')
  .controller('ListSelectDialogCtrl', function($scope, $uibModalInstance, items) {

    $scope.items = items;

    $scope.onAccept = function(item) {
      $uibModalInstance.close(item);
    };

  });
