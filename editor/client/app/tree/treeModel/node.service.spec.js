'use strict';

describe('Service: Node', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  // instantiate service
  let Node;
  beforeEach(inject(function(_Node_) {
    Node = _Node_;
  }));

  it('updateVersion should inc node version',
    function() {
      let node = {
        $meta: {
          version: 1
        }
      };
      Node.updateVersion(node);

      expect(node.$meta.version).toBe(2);
    });

  it('updateVersion should set node version to 1 if it is equal to Number.MAX_SAFE_INTEGER',
    function() {
      let node = {
        $meta: {
          version: Number.MAX_SAFE_INTEGER
        }
      };
      Node.updateVersion(node);

      expect(node.$meta.version).toBe(1);
    });
});
