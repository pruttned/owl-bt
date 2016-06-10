'use strict';

describe('Service: AddTreeNodeSubItemAction', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  // instantiate service
  let TreeStore;
  let AddTreeNodeSubItemAction;
  let UndoRedoManager;
  let node;
  beforeEach(inject(function(_TreeStore_, _AddTreeNodeSubItemAction_, _UndoRedoManager_) {
    TreeStore = _TreeStore_;
    AddTreeNodeSubItemAction = _AddTreeNodeSubItemAction_;
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
      }]
    };
  }));

  it('exec without index should add sub item to the end and update versions', function() {
    let params = {
      node: node,
      subItem: {
        type: 'newS',
        $meta:{}
      },
      subItemType : 'service'
    };
    AddTreeNodeSubItemAction.exec(params);

    expect(node.$meta.version).toBe(2);
    expect(TreeStore.version).toBe(2);
    expect(node.services.length).toBe(3);
    expect(node.services[0].type).toBe('s1');
    expect(node.services[1].type).toBe('s2');
    expect(node.services[2].type).toBe('newS');
  });

  it('exec with index should add sub item to the specified index and update versions', function() {
    let params = {
      node: node,
      subItem: {
        type: 'newS',
        $meta:{}
      },
      subItemType : 'service',
      index: 1
    };
    AddTreeNodeSubItemAction.exec(params);

    expect(node.$meta.version).toBe(2);
    expect(TreeStore.version).toBe(2);
    expect(node.services.length).toBe(3);
    expect(node.services[0].type).toBe('s1');
    expect(node.services[1].type).toBe('newS');
    expect(node.services[2].type).toBe('s2');
  });

  it('undo should remove sub item and update versions', function() {
    let params = {
      node: node,
      subItem: {
        type: 'newS',
        $meta:{}
      },
      subItemType : 'service',
      index: 1
    };
    AddTreeNodeSubItemAction.exec(params);
    UndoRedoManager.undo();

    expect(node.$meta.version).toBe(3);
    expect(TreeStore.version).toBe(3);
    expect(node.services.length).toBe(2);
    expect(node.services[0].type).toBe('s1');
    expect(node.services[1].type).toBe('s2');
  });
});
