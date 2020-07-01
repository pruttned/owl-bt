'use strict';

describe('Service: RemoveTreeNodeSubItemAction', function() {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  // instantiate service
  let TreeStore;
  let RemoveTreeNodeSubItemAction;
  let UndoRedoManager;
  let node;
  beforeEach(() => inject(function(_TreeStore_, _RemoveTreeNodeSubItemAction_, _UndoRedoManager_) {
    TreeStore = _TreeStore_;
    RemoveTreeNodeSubItemAction = _RemoveTreeNodeSubItemAction_;
    UndoRedoManager = _UndoRedoManager_;

    node = {
      $meta: {
        version: 1,
        id: 1
      },
      services: [{
        type: 's1',
        $meta: {
          nodeId: 1
        }
      }, {
        type: 's2',
        $meta: {
          nodeId: 1
        }
      }, {
        type: 's3',
        $meta: {
          nodeId: 1
        }
      }]
    };
  }));

  it('exec should remove sub item and update versions', function() {
    let params = {
      node: node,
      subItem: node.services[1],
    };
    RemoveTreeNodeSubItemAction.exec(params);

    expect(node.$meta.version).toBe(2);
    expect(TreeStore.version).toBe(2);
    expect(node.services.length).toBe(2);
    expect(node.services[0].type).toBe('s1');
    expect(node.services[1].type).toBe('s3');
  });

  it('undo should add previous sub item and update versions', function() {
    let params = {
      node: node,
      subItem: node.services[1],
    };
    RemoveTreeNodeSubItemAction.exec(params);
    UndoRedoManager.undo();

    expect(node.$meta.version).toBe(3);
    expect(TreeStore.version).toBe(3);
    expect(node.services.length).toBe(3);
    expect(node.services[0].type).toBe('s1');
    expect(node.services[1].type).toBe('s2');
    expect(node.services[2].type).toBe('s3');
  });
});
