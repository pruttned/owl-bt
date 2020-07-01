'use strict';

describe('Service: TreeNodeByIdStore', function() {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  // instantiate service
  let TreeNodeByIdStore;
  beforeEach(() => inject(function(_TreeNodeByIdStore_) {
    TreeNodeByIdStore = _TreeNodeByIdStore_;
  }));

  it('add should register the node that is then retrievable through getNode', function() {
    let node = {
      $meta: {
        id: 10,
      },
    };
    expect(TreeNodeByIdStore.getNode(10)).not.toBeDefined();
    TreeNodeByIdStore.addNode(node);
    expect(TreeNodeByIdStore.getNode(10)).toBe(node);
  });

  it('getNode should not return node after it has been removed', function() {
    let node = {
      $meta: {
        id: 10,
      },
    };
    TreeNodeByIdStore.addNode(node);
    expect(TreeNodeByIdStore.getNode(10)).toBe(node);
    TreeNodeByIdStore.removeNode(node);
    expect(TreeNodeByIdStore.getNode(10)).not.toBeDefined();
  });
});
