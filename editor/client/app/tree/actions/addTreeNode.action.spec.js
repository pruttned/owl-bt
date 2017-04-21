'use strict';

describe('Service: AddTreeNodeAction', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  // instantiate service
  let TreeStore;
  let AddTreeNodeAction;
  let UndoRedoManager;
  let node;
  beforeEach(inject(function(_TreeStore_, _AddTreeNodeAction_, _UndoRedoManager_) {
    TreeStore = _TreeStore_;
    AddTreeNodeAction = _AddTreeNodeAction_;
    UndoRedoManager = _UndoRedoManager_;

    node = {
      $meta: {
        version: 1,
        id: 1
      },
      childNodes: [{
        type: 'n1',
        $meta: {
          nodeId: 1
        }
      }, {
        type: 'n2',
        $meta: {
          nodeId: 1
        }
      }]
    };
  }));

  it('exec without index should add node to the end and update versions', function() {
    let params = {
      node: node,
      childNode: {
        type: 'newN',
        $meta:{}
      },
    };
    AddTreeNodeAction.exec(params);

    expect(node.$meta.version).toBe(2);
    expect(TreeStore.version).toBe(2);
    expect(node.childNodes.length).toBe(3);
    expect(node.childNodes[0].type).toBe('n1');
    expect(node.childNodes[1].type).toBe('n2');
    expect(node.childNodes[2].type).toBe('newN');
  });

  it('exec with index should add node to the specified index and update versions', function() {
    let params = {
      node: node,
      childNode: {
        type: 'newN',
        $meta:{}
      },
      index: 1
    };
    AddTreeNodeAction.exec(params);

    expect(node.$meta.version).toBe(2);
    expect(TreeStore.version).toBe(2);
    expect(node.childNodes.length).toBe(3);
    expect(node.childNodes[0].type).toBe('n1');
    expect(node.childNodes[1].type).toBe('newN');
    expect(node.childNodes[2].type).toBe('n2');
  });

  it('undo should remove node and update versions', function() {
    let params = {
      node: node,
      childNode: {
        type: 'newN',
        $meta:{}
      },
      index: 1
    };
    AddTreeNodeAction.exec(params);
    UndoRedoManager.undo();

    expect(node.$meta.version).toBe(3);
    expect(TreeStore.version).toBe(3);
    expect(node.childNodes.length).toBe(2);
    expect(node.childNodes[0].type).toBe('n1');
    expect(node.childNodes[1].type).toBe('n2');
  });
});
