'use strict';

describe('Service: RemoveTreeNodeSubItemCmd', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  // instantiate service
  let TreeStore;
  let RemoveTreeNodeSubItemCmd;
  let node;
  beforeEach(inject(function(_TreeStore_, _RemoveTreeNodeSubItemCmd_) {
    TreeStore = _TreeStore_;
    RemoveTreeNodeSubItemCmd = _RemoveTreeNodeSubItemCmd_;

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
    let cmd = RemoveTreeNodeSubItemCmd.create(params);
    cmd.exec();

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
    let cmd = RemoveTreeNodeSubItemCmd.create(params);
    cmd.exec();
    cmd.undo();

    expect(node.$meta.version).toBe(3);
    expect(TreeStore.version).toBe(3);
    expect(node.services.length).toBe(3);
    expect(node.services[0].type).toBe('s1');
    expect(node.services[1].type).toBe('s2');
    expect(node.services[2].type).toBe('s3');
  });
});
