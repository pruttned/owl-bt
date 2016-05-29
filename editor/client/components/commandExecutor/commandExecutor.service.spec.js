'use strict';

describe('Service: CommandExecutor', function() {

  // load the service's module
  let log;
  let testCommand;
  let testAsyncCommand;
  beforeEach(module('editorApp', function() {

    log = [];

    testCommand = {
      exec: function() {
        log.push('TestCommand-exec');
      },
      undo: function() {
        log.push('TestCommand-undo');
      }
    };

    testAsyncCommand = {
      exec: function() {
        setTimeout(function() {
          log.push('AsyncTestCommand-exec');
        }, 100);
      }
    };
  }));

  // instantiate service
  let CommandExecutor;
  let UndoRedoManager;
  let $scope;
  beforeEach(inject(function($rootScope, _CommandExecutor_, _UndoRedoManager_) {
    CommandExecutor = _CommandExecutor_;
    UndoRedoManager = _UndoRedoManager_;
    $scope = $rootScope.$new();
  }));

  it('exec should call exec method of a given command service',
    function(done) {

      CommandExecutor.exec(testCommand)
        .then(() => {
          expect(log.length).toBe(1);
          expect(log[0]).toBe('TestCommand-exec');

          done();
        });

      $scope.$apply(); //resolve promises
    });

  it('exec should fail while another command is being executed',
    function(done) {

      CommandExecutor.exec(testAsyncCommand)
        .then(done);
      expect(() => CommandExecutor.exec(testCommand)).toThrowError(/bussy/);

      $scope.$apply(); //resolve promises
    });

  it('should be possible to call another command after the current is finished',
    function(done) {

      CommandExecutor.exec(testAsyncCommand)
        .then(() => {
          expect(() => CommandExecutor.exec(testCommand)).not.toThrowError(/bussy/);

          done();
        });

      $scope.$apply(); //resolve promises
    });

  it('exec should add command to undo redo stack',
    function(done) {

      CommandExecutor.exec(testCommand)
        .then(() => {

          UndoRedoManager.undo();
          expect(log.length).toBe(2);
          expect(log[1]).toBe('TestCommand-undo');

          done();
        });

      $scope.$apply(); //resolve promises
    });
});
