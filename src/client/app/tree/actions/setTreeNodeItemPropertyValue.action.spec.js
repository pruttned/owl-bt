'use strict';

describe('Service: SetTreeNodeItemPropertyValueAction', function () {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  beforeEach(() => angular.mock.module('mocks.TreeStore'));

  // instantiate service
  let TreeStore;
  let SetTreeNodeItemPropertyValueAction;
  let UndoRedoManager;
  beforeEach(() => inject(function (_TreeStore_, _SetTreeNodeItemPropertyValueAction_, _UndoRedoManager_) {
    TreeStore = _TreeStore_;
    SetTreeNodeItemPropertyValueAction = _SetTreeNodeItemPropertyValueAction_;
    UndoRedoManager = _UndoRedoManager_;
  }));

  it('exec should set node item property and update versions', function () {
    let node = {
      $meta: {
        version: 1
      },
      services: [{
        $meta: {
          desc: {
            properties: [
              {
                name: 'prop1',
                type: 'string'
              }
            ]
          }
        },
        properties: {
          prop1: 'oldValue'
        }
      }]
    };
    let params = {
      node: node,
      nodeItem: node.services[0],
      property: 'prop1',
      value: 'newValue'
    };
    SetTreeNodeItemPropertyValueAction.exec(params);

    expect(node.$meta.version).toBe(2);
    expect(TreeStore.version).toBe(2);
    expect(node.services[0].properties.prop1).toBe('newValue');
  });

  it('undo should set node property to its previous value if it was set and update versions', function () {
    let node = {
      $meta: {
        version: 1
      },
      services: [{
        $meta: {
          desc: {
            properties: [
              {
                name: 'prop1',
                type: 'string'
              }
            ]
          }
        },
        properties: {
          prop1: 'oldValue'
        }
      }]
    };
    let params = {
      node: node,
      nodeItem: node.services[0],
      property: 'prop1',
      value: 'newValue'
    };
    SetTreeNodeItemPropertyValueAction.exec(params);
    UndoRedoManager.undo();

    expect(node.$meta.version).toBe(3);
    expect(TreeStore.version).toBe(3);
    expect(node.services[0].properties.prop1).toBe('oldValue');
  });

  it('undo should reset node property if it was not set and update versions', function () {
    let node = {
      $meta: {
        version: 1
      },
      services: [{
        $meta: {
          desc: {
            properties: [
              {
                name: 'prop1',
                type: 'string'
              }
            ]
          }
        },
        properties: {
          prop2: '1' //to keep properties obj alive during reset
        }
      }]
    };
    let params = {
      node: node,
      nodeItem: node.services[0],
      property: 'prop1',
      value: 'newValue'
    };
    SetTreeNodeItemPropertyValueAction.exec(params);
    UndoRedoManager.undo();

    expect(node.$meta.version).toBe(3);
    expect(TreeStore.version).toBe(3);
    expect(node.services[0].properties.prop1).toBeUndefined();
  });

});
