'use strict';

angular.module('editorApp')
  .service('UndoRedoManager',
    class UndoRedoManager {
      constructor(undoStackSize){
        this._undoManager = new window.UndoManager();
        this._undoManager.setLimit(undoStackSize);
      }

      /**
       * Add undo/redo command to stack
       * @param {undoRedoCommand} undoRedoCommand
       * @param {function} undoRedoCommand.undo - function to undo change
       * @param {function} undoRedoCommand.exec - function to redo change
       */
      add(undoRedoCommand){
        this._undoManager.add({
          undo: undoRedoCommand.undo,
          redo: undoRedoCommand.exec
        });
      }

      undo(){
        this._undoManager.undo();
      }

      redo(){
        this._undoManager.redo();
      }
    });
