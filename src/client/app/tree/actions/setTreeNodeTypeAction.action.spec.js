'use strict';

describe('Service: SetTreeNodeTypeAction', function () {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  beforeEach(() => angular.mock.module('mocks.TreeStore'));

  // instantiate service
  let TreeStore;
  let SetTreeNodeTypeAction;
  let UndoRedoManager;
  let node;
  let params;
  let oldDesc;
  beforeEach(() => inject(function (_TreeStore_, _SetTreeNodeTypeAction_, _UndoRedoManager_) {
    TreeStore = _TreeStore_;
    SetTreeNodeTypeAction = _SetTreeNodeTypeAction_;
    UndoRedoManager = _UndoRedoManager_;

    oldDesc = {
      name: 'oldDesc',
    };
    node = {
      $meta: {
        version: 1,
        desc: oldDesc
      },
      services: [{
        type: 'svc'
      }],
      properties: {
        prop1: 'v',
        prop2: 'v2'
      }
    };

    params = {
      node: node,
      desc: {
        name: 'newDesc',
        properties: [
          {
            name: 'prop1'
          },
          {
            name: 'prop3'
          }
        ]
      }
    };
  }));



  it('exec should change node type and update versions', function () {

    SetTreeNodeTypeAction.exec(params);

    expect(node.type).toBe('newDesc');
    expect(node.$meta.desc).toBe(params.desc);
    expect(node.$meta.version).toBe(2);
    expect(node.$meta.version).toBe(2);
    expect(TreeStore.version).toBe(2);
  });


  it('exec should keep common properties', function () {

    SetTreeNodeTypeAction.exec(params);

    expect(node.properties.prop1).toBe('v');
    expect(node.properties).not.toHaveProperty('prop2');
    expect(node.properties).not.toHaveProperty('prop3');
  });

  it('exec should keep sub items', function () {

    SetTreeNodeTypeAction.exec(params);

    expect(node.services[0].type).toBe('svc');
  });

  it('undo should change node type and update versions', function () {

    SetTreeNodeTypeAction.exec(params);
    UndoRedoManager.undo();

    expect(node.type).toBe('oldDesc');
    expect(node.$meta.desc).toBe(oldDesc);
    expect(node.$meta.version).toBe(3);
    expect(node.$meta.version).toBe(3);
    expect(TreeStore.version).toBe(3);
  });


  it('undo should set old properties', function () {
    SetTreeNodeTypeAction.exec(params);
    UndoRedoManager.undo();

    expect(node.properties.prop1).toBe('v');
    expect(node.properties.prop2).toBe('v2');
    expect(node.properties).not.toHaveProperty('prop3');
  });

  it('undo should keep sub items', function () {

    SetTreeNodeTypeAction.exec(params);
    UndoRedoManager.undo();

    expect(node.services[0].type).toBe('svc');
  });
});
