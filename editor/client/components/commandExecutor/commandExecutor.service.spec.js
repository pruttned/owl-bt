'use strict';

describe('Service: CommandExecutor', function() {

  class TestCommand {
    create(params) {
      return {
        exec: function() {
          params.log.push('TestCommand-exec');
        },
        undo: function() {
          params.log.push('TestCommand-undo');
        }
      };
    }
  }

  class AsyncTestCommand {
    create(params) {
      return {
        exec: function() {
          setTimeout(function() {
            params.log.push('AsyncTestCommand-exec');
          }, 100);
        }
      };
    }
  }

  // load the service's module
  beforeEach(module('editorApp', function($provide) {
    $provide.service('TestCommand', TestCommand);
    $provide.service('AsyncTestCommand', AsyncTestCommand);
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

      let params = {
        log: []
      };

      CommandExecutor.exec('TestCommand', params)
        .then(() => {
          expect(params.log.length).toBe(1);
          expect(params.log[0]).toBe('TestCommand-exec');

          done();
        });

      $scope.$apply(); //resolve promises
    });

  it('exec should fail while another command is being executed',
    function(done) {

      let params = {
        log: []
      };

      CommandExecutor.exec('AsyncTestCommand', params)
        .then(done);
      expect(() => CommandExecutor.exec('TestCommand', params)).toThrowError(/bussy/);

      $scope.$apply(); //resolve promises
    });

  it('should be possible to call another command after the current is finished',
    function(done) {

      let params = {
        log: []
      };

      CommandExecutor.exec('AsyncTestCommand', params)
        .then(() => {
          expect(() => CommandExecutor.exec('TestCommand', params)).not.toThrowError(/bussy/);

          done();
        });

      $scope.$apply(); //resolve promises
    });

  it('exec should add command to undo redo stack',
    function(done) {

      let params = {
        log: []
      };

      CommandExecutor.exec('TestCommand', params)
        .then(() => {

          UndoRedoManager.undo();
          expect(params.log.length).toBe(2);
          expect(params.log[1]).toBe('TestCommand-undo');

          done();
        });

      $scope.$apply(); //resolve promises
    });
});
