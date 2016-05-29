'use strict';

describe('Service: ResetTreeNodeItemPropertyValueCmd', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  beforeEach(module('mocks.TreeStore'));

  // instantiate service
  let TreeStore;
  let ResetTreeNodeItemPropertyValueCmd;
  let UndoRedoManager;
  beforeEach(inject(function(_TreeStore_, _ResetTreeNodeItemPropertyValueCmd_, _UndoRedoManager_) {
    TreeStore = _TreeStore_;
    ResetTreeNodeItemPropertyValueCmd = _ResetTreeNodeItemPropertyValueCmd_;
    UndoRedoManager = _UndoRedoManager_;
  }));

  it('exec should reset node item property and update versions', function() {
    let node = {
      $meta: {
        version: 1
      },
      services: [{
        properties: {
          prop1: 'oldValue',
          prop2: '1'//to keep properties obj alive during reset
        }
      }]
    };
    let params = {
      node: node,
      nodeItem: node.services[0],
      property: 'prop1',
    };
    ResetTreeNodeItemPropertyValueCmd.exec(params);

    expect(node.$meta.version).toBe(2);
    expect(TreeStore.version).toBe(2);
    expect(node.services[0].properties.prop1).toBeUndefined();
  });

  it('undo should set node property to its previous value if it was set and update versions', function() {
    let node = {
      $meta: {
        version: 1
      },
      services: [{
        properties: {
          prop1: 'oldValue'
        }
      }]
    };
    let params = {
      node: node,
      nodeItem: node.services[0],
      property: 'prop1',
    };
    ResetTreeNodeItemPropertyValueCmd.exec(params);
    UndoRedoManager.undo();
    
    expect(node.$meta.version).toBe(3);
    expect(TreeStore.version).toBe(3);
    expect(node.services[0].properties.prop1).toBe('oldValue');
  });
});
