'use strict';

describe('Service: RemoveTreeNodeAction', function() {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  // instantiate service
  let TreeStore;
  let RemoveTreeNodeAction;
  let UndoRedoManager;
  let node;
  beforeEach(() => inject(function(_TreeStore_, _RemoveTreeNodeAction_, _UndoRedoManager_) {
    TreeStore = _TreeStore_;
    RemoveTreeNodeAction = _RemoveTreeNodeAction_;
    UndoRedoManager = _UndoRedoManager_;

    node = {
      $meta: {
        version: 1,
        id: 1
      },
      childNodes: [{
        type: 'n1',
        $meta: {
          parentId: 1
        }
      }, {
        type: 'n2',
        $meta: {
          parentId: 1
        }
      }, {
        type: 'n3',
        $meta: {
          parentId: 1
        }
      }]
    };
  }));

  it('exec should remove child node and update versions', function() {
    let params = {
      node: node,
      childNode: node.childNodes[0],
    };
    RemoveTreeNodeAction.exec(params);

    expect(node.$meta.version).toBe(2);
    expect(TreeStore.version).toBe(2);
    expect(node.childNodes.length).toBe(2);
    expect(node.childNodes[0].type).toBe('n2');
    expect(node.childNodes[1].type).toBe('n3');
  });

  it('undo should add previous child node and update versions', function() {
    let params = {
      node: node,
      childNode: node.childNodes[0],
    };
    RemoveTreeNodeAction.exec(params);
    UndoRedoManager.undo();

    expect(node.$meta.version).toBe(3);
    expect(TreeStore.version).toBe(3);
    expect(node.childNodes.length).toBe(3);
    expect(node.childNodes[0].type).toBe('n1');
    expect(node.childNodes[1].type).toBe('n2');
    expect(node.childNodes[2].type).toBe('n3');
  });
});
