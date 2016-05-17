'use strict';

describe('Service: SetTreeNodeItemPropertyValueCmd', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  beforeEach(module('mocks.TreeStore'));

  // instantiate service
  let TreeStore;
  let SetTreeNodeItemPropertyValueCmd;
  beforeEach(inject(function(_TreeStore_, _SetTreeNodeItemPropertyValueCmd_) {
    TreeStore = _TreeStore_;
    SetTreeNodeItemPropertyValueCmd = _SetTreeNodeItemPropertyValueCmd_;
  }));

  it('exec should set node item property and update versions', function() {
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
      value: 'newValue'
    };
    let cmd = SetTreeNodeItemPropertyValueCmd.create(params);
    cmd.exec();

    expect(node.$meta.version).toBe(2);
    expect(TreeStore.version).toBe(2);
    expect(node.services[0].properties.prop1).toBe('newValue');
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
      value: 'newValue'
    };
    let cmd = SetTreeNodeItemPropertyValueCmd.create(params);
    cmd.exec();
    cmd.undo();

    expect(node.$meta.version).toBe(3);
    expect(TreeStore.version).toBe(3);
    expect(node.services[0].properties.prop1).toBe('oldValue');
  });

  it('undo should reset node property if it was not set and update versions', function() {
    let node = {
      $meta: {
        version: 1
      },
      services: [{
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
    let cmd = SetTreeNodeItemPropertyValueCmd.create(params);
    cmd.exec();
    cmd.undo();

    expect(node.$meta.version).toBe(3);
    expect(TreeStore.version).toBe(3);
    expect(node.services[0].properties.prop1).toBeUndefined();
  });

});
