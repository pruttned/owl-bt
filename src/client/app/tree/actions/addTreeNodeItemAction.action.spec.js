'use strict';

describe('Service: AddTreeNodeItemAction', function () {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  // instantiate service
  let TreeStore;
  let AddTreeNodeItemAction;
  let UndoRedoManager;
  beforeEach(() => inject(function (_TreeStore_, _AddTreeNodeItemAction_, _UndoRedoManager_) {
    TreeStore = _TreeStore_;
    AddTreeNodeItemAction = _AddTreeNodeItemAction_;
    UndoRedoManager = _UndoRedoManager_;
  }));

  describe('Add node', () => {
    let node;
    beforeEach(() => {
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
    });

    it('exec without index should add node to the end and update versions', function () {
      let params = {
        node: node,
        itemType: 'node',
        item: {
          type: 'newN',
          $meta: {}
        },
      };
      AddTreeNodeItemAction.exec(params);

      expect(node.$meta.version).toBe(2);
      expect(TreeStore.version).toBe(2);
      expect(node.childNodes.length).toBe(3);
      expect(node.childNodes[0].type).toBe('n1');
      expect(node.childNodes[1].type).toBe('n2');
      expect(node.childNodes[2].type).toBe('newN');
    });

    it('exec with index should add node to the specified index and update versions', function () {
      let params = {
        node: node,
        itemType: 'node',
        item: {
          type: 'newN',
          $meta: {}
        },
        index: 1
      };
      AddTreeNodeItemAction.exec(params);

      expect(node.$meta.version).toBe(2);
      expect(TreeStore.version).toBe(2);
      expect(node.childNodes.length).toBe(3);
      expect(node.childNodes[0].type).toBe('n1');
      expect(node.childNodes[1].type).toBe('newN');
      expect(node.childNodes[2].type).toBe('n2');
    });

    it('undo should remove node and update versions', function () {
      let params = {
        node: node,
        itemType: 'node',
        item: {
          type: 'newN',
          $meta: {}
        },
        index: 1
      };
      AddTreeNodeItemAction.exec(params);
      UndoRedoManager.undo();

      expect(node.$meta.version).toBe(3);
      expect(TreeStore.version).toBe(3);
      expect(node.childNodes.length).toBe(2);
      expect(node.childNodes[0].type).toBe('n1');
      expect(node.childNodes[1].type).toBe('n2');
    });
  });


  describe('Add sub item', () => {
    let node;
    beforeEach(() => {
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
    });

    it('exec without index should add sub item to the end and update versions', function () {
      let params = {
        node: node,
        item: {
          type: 'newS',
          $meta: {}
        },
        itemType: 'service'
      };
      AddTreeNodeItemAction.exec(params);

      expect(node.$meta.version).toBe(2);
      expect(TreeStore.version).toBe(2);
      expect(node.services.length).toBe(3);
      expect(node.services[0].type).toBe('s1');
      expect(node.services[1].type).toBe('s2');
      expect(node.services[2].type).toBe('newS');
    });

    it('exec with index should add sub item to the specified index and update versions', function () {
      let params = {
        node: node,
        item: {
          type: 'newS',
          $meta: {}
        },
        itemType: 'service',
        index: 1
      };
      AddTreeNodeItemAction.exec(params);

      expect(node.$meta.version).toBe(2);
      expect(TreeStore.version).toBe(2);
      expect(node.services.length).toBe(3);
      expect(node.services[0].type).toBe('s1');
      expect(node.services[1].type).toBe('newS');
      expect(node.services[2].type).toBe('s2');
    });

    it('undo should remove sub item and update versions', function () {
      let params = {
        node: node,
        item: {
          type: 'newS',
          $meta: {}
        },
        itemType: 'service',
        index: 1
      };
      AddTreeNodeItemAction.exec(params);
      UndoRedoManager.undo();

      expect(node.$meta.version).toBe(3);
      expect(TreeStore.version).toBe(3);
      expect(node.services.length).toBe(2);
      expect(node.services[0].type).toBe('s1');
      expect(node.services[1].type).toBe('s2');
    });
  });
});