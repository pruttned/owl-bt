'use strict';

describe('Service: ActionExecutor', function() {

  // load the service's module
  let log;
  let testAction;
  let testAsyncAction;
  beforeEach(() => angular.mock.module('editorApp', function() {

    log = [];

    testAction = {
      exec: function() {
        log.push('TestAction-exec');
      },
      undo: function() {
        log.push('TestAction-undo');
      }
    };

    testAsyncAction = {
      exec: function() {
        setTimeout(function() {
          log.push('AsyncTestAction-exec');
        }, 100);
      }
    };
  }));

  // instantiate service
  let ActionExecutor;
  let UndoRedoManager;
  let $scope;
  beforeEach(() => inject(function($rootScope, _ActionExecutor_, _UndoRedoManager_) {
    ActionExecutor = _ActionExecutor_;
    UndoRedoManager = _UndoRedoManager_;
    $scope = $rootScope.$new();
  }));

  it('exec should call exec method of a given action service',
    function(done) {

      ActionExecutor.exec(testAction)
        .then(() => {
          expect(log.length).toBe(1);
          expect(log[0]).toBe('TestAction-exec');

          done();
        });

      $scope.$apply(); //resolve promises
    });

  it('exec should fail while another action is being executed',
    function(done) {

      ActionExecutor.exec(testAsyncAction)
        .then(done);
      expect(() => ActionExecutor.exec(testAction)).toThrowError(/bussy/);

      $scope.$apply(); //resolve promises
    });

  it('should be possible to call another action after the current is finished',
    function(done) {

      ActionExecutor.exec(testAsyncAction)
        .then(() => {
          expect(() => ActionExecutor.exec(testAction)).not.toThrowError(/bussy/);

          done();
        });

      $scope.$apply(); //resolve promises
    });

  it('exec should add action to undo redo stack',
    function(done) {

      ActionExecutor.exec(testAction)
        .then(() => {

          UndoRedoManager.undo();
          expect(log.length).toBe(2);
          expect(log[1]).toBe('TestAction-undo');

          done();
        });

      $scope.$apply(); //resolve promises
    });
});
