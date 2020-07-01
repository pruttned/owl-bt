'use strict';

describe('Controller: TreeCtrl', function () {

  // load the controller's module
  beforeEach(() => angular.mock.module('editorApp'));

  var TreeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(() => inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TreeCtrl = $controller('TreeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
