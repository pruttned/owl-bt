'use strict';

describe('Service: Node', function() {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  // instantiate service
  let TreeNode;
  beforeEach(() => inject(function(_TreeNode_) {
    TreeNode = _TreeNode_;
  }));

  it('updateVersion should inc node version',
    function() {
      let node = {
        $meta: {
          version: 1
        }
      };
      TreeNode.updateVersion(node);

      expect(node.$meta.version).toBe(2);
    });

  it('updateVersion should set node version to 1 if it is equal to Number.MAX_SAFE_INTEGER',
    function() {
      let node = {
        $meta: {
          version: Number.MAX_SAFE_INTEGER
        }
      };
      TreeNode.updateVersion(node);

      expect(node.$meta.version).toBe(1);
    });

  it('getSubItemAt should return service at a given index',
    function() {
      let node = {
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
        }],
        decorators: [{
          type: 'd1',
          $meta: {
            nodeId: 1
          }
        }, {
          type: 'd2',
          $meta: {
            nodeId: 1
          }
        }]
      };
      let item = TreeNode.getSubItemAt(node, 'service', 1);

      expect(item).toBeDefined();
      expect(item.type).toBe('s2');
    });
  it('getSubItemAt should return decorator at a given index',
    function() {
      let node = {
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
        }],
        decorators: [{
          type: 'd1',
          $meta: {
            nodeId: 1
          }
        }, {
          type: 'd2',
          $meta: {
            nodeId: 1
          }
        }]
      };
      let item = TreeNode.getSubItemAt(node, 'decorator', 1);

      expect(item).toBeDefined();
      expect(item.type).toBe('d2');
    });

    it('getSubItemAt should return undefined for invalid index',
      function() {
        let node = {
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
          }],
          decorators: [{
            type: 'd1',
            $meta: {
              nodeId: 1
            }
          }, {
            type: 'd2',
            $meta: {
              nodeId: 1
            }
          }]
        };
        let item = TreeNode.getSubItemAt(node, 'decorator', 100);

        expect(item).not.toBeDefined();
      });

  it('addService should add service to node services array and set node to service $meta object',
    function() {
      let node = {
        $meta: {
          id: 10
        }
      };
      let service = {
        $meta: {}
      };
      TreeNode.addService(node, service);

      expect(node.services).toBeDefined();
      expect(node.services.length).toBe(1);
      expect(node.services[0]).toBe(service);
      expect(service.$meta.nodeId).toBe(10);
    });

  it('addDecorator should add decorator to node decorators array and set node to decorator $meta object',
    function() {
      let node = {
        $meta: {
          id: 10
        }
      };
      let decorator = {
        $meta: {}
      };
      TreeNode.addDecorator(node, decorator);

      expect(node.decorators).toBeDefined();
      expect(node.decorators.length).toBe(1);
      expect(node.decorators[0]).toBe(decorator);
      expect(decorator.$meta.nodeId).toBe(10);
    });

  it('addChildNode should add child node to childNodes array of the parent node and set node to child node $meta object',
    function() {
      let node = {
        $meta: {
          id: 10
        }
      };
      let childNode = {
        $meta: {}
      };
      TreeNode.addChildNode(node, childNode);

      expect(node.childNodes).toBeDefined();
      expect(node.childNodes.length).toBe(1);
      expect(node.childNodes[0]).toBe(childNode);
      expect(childNode.$meta.parentId).toBe(10);
    });

  it('removeService should remove service from node and reset nodeId in its $meta',
    function() {
      let node = {
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
      let service = node.services[0];
      TreeNode.removeService(node, service);

      expect(node.services.length).toBe(1);
      expect(node.services[0]).not.toBe(service);
      expect(service.$meta.nodeId).not.toBeDefined();
    });

  it('removeDecorator should remove decorator from node and reset nodeId in its $meta',
    function() {
      let node = {
        decorators: [{
          type: 'd1',
          $meta: {
            nodeId: 1
          }
        }, {
          type: 'd2',
          $meta: {
            nodeId: 1
          }
        }]
      };
      let decorator = node.decorators[0];
      TreeNode.removeDecorator(node, decorator);

      expect(node.decorators.length).toBe(1);
      expect(node.decorators[0]).not.toBe(decorator);
      expect(decorator.$meta.nodeId).not.toBeDefined();
    });

  it('removeChildNode should remove childNode from node and reset parentId in its $meta',
    function() {
      let node = {
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
        }]
      };
      let childNode = node.childNodes[0];
      TreeNode.removeChildNode(node, childNode);

      expect(node.childNodes.length).toBe(1);
      expect(node.childNodes[0]).not.toBe(childNode);
      expect(childNode.$meta.parentId).not.toBeDefined();
    });

  it('addSubItemAt should add item at a specified index',
    function() {
      let node = {
        $meta: {
          id: 1
        },
        services: [{
          type: 's1',
        }, {
          type: 's2',
        }]
      };
      let service = {
        type: 'new',
        $meta: {}
      };
      TreeNode.addSubItemAt(node, service, 'service', 1);

      expect(node.services.length).toBe(3);
      expect(node.services[0].type).toBe('s1');
      expect(node.services[1].type).toBe('new');
      expect(node.services[2].type).toBe('s2');
    });

  it('addChildNode should add node at a specified index',
    function() {
      let node = {
        $meta: {
          id: 1
        },
        childNodes: [{
          type: 'n1',
        }, {
          type: 'n2',
        }]
      };
      let childNode = {
        type: 'new',
        $meta: {}
      };
      TreeNode.addChildNodeAt(node, childNode, 1);

      expect(node.childNodes.length).toBe(3);
      expect(node.childNodes[0].type).toBe('n1');
      expect(node.childNodes[1].type).toBe('new');
      expect(node.childNodes[2].type).toBe('n2');
    });

  describe('Service: Node - move sub item', function() {
    let node;
    beforeEach(function() {
      node = {
        services: [{
          type: 's1'
        }, {
          type: 's2'
        }, {
          type: 's3'
        }, ],
        decorators: [{
          type: 'd1'
        }, {
          type: 'd2'
        }, {
          type: 'd3'
        }, ]
      };
    });

    it('moveSubItem up should move service up',
      function() {
        TreeNode.moveSubItem(node, node.services[1], true);
        expect(node).toEqual({
          services: [{
            type: 's2'
          }, {
            type: 's1'
          }, {
            type: 's3'
          }, ],
          decorators: [{
            type: 'd1'
          }, {
            type: 'd2'
          }, {
            type: 'd3'
          }, ]
        });
      });

    it('moveSubItem up should move decorator up',
      function() {
        TreeNode.moveSubItem(node, node.decorators[1], true);
        expect(node).toEqual({
          services: [{
            type: 's1'
          }, {
            type: 's2'
          }, {
            type: 's3'
          }, ],
          decorators: [{
            type: 'd2'
          }, {
            type: 'd1'
          }, {
            type: 'd3'
          }, ]
        });
      });

    it('moveSubItem down should move service down',
      function() {
        TreeNode.moveSubItem(node, node.services[1], false);
        expect(node).toEqual({
          services: [{
            type: 's1'
          }, {
            type: 's3'
          }, {
            type: 's2'
          }, ],
          decorators: [{
            type: 'd1'
          }, {
            type: 'd2'
          }, {
            type: 'd3'
          }, ]
        });
      });

    it('moveSubItem down should move decorator down',
      function() {
        TreeNode.moveSubItem(node, node.decorators[1], false);
        expect(node).toEqual({
          services: [{
            type: 's1'
          }, {
            type: 's2'
          }, {
            type: 's3'
          }, ],
          decorators: [{
            type: 'd1'
          }, {
            type: 'd3'
          }, {
            type: 'd2'
          }, ]
        });
      });

    it('canMoveSubItem up should return false for top service',
      function() {
        expect(TreeNode.canMoveSubItem(node, node.services[0], true)).toBe(false);
      });

    it('canMoveSubItem down should return false for bottom service',
      function() {
        expect(TreeNode.canMoveSubItem(node, node.services[2], false)).toBe(false);
      });

    it('canMoveSubItem up should return true for non top service',
      function() {
        expect(TreeNode.canMoveSubItem(node, node.services[1], true)).toBe(true);
        expect(TreeNode.canMoveSubItem(node, node.services[2], true)).toBe(true);
      });

    it('canMoveSubItem down should return true for non bottom service',
      function() {
        expect(TreeNode.canMoveSubItem(node, node.services[0], false)).toBe(true);
        expect(TreeNode.canMoveSubItem(node, node.services[1], true)).toBe(true);
      });

    it('canMoveSubItem up should return false for top decorator',
      function() {
        expect(TreeNode.canMoveSubItem(node, node.decorators[0], true)).toBe(false);
      });

    it('canMoveSubItem down should return false for bottom decorator',
      function() {
        expect(TreeNode.canMoveSubItem(node, node.decorators[2], false)).toBe(false);
      });

    it('canMoveSubItem up should return true for non top decorator',
      function() {
        expect(TreeNode.canMoveSubItem(node, node.decorators[1], true)).toBe(true);
        expect(TreeNode.canMoveSubItem(node, node.decorators[2], true)).toBe(true);
      });

    it('canMoveSubItem down should return true for non bottom decorator',
      function() {
        expect(TreeNode.canMoveSubItem(node, node.decorators[0], false)).toBe(true);
        expect(TreeNode.canMoveSubItem(node, node.decorators[1], true)).toBe(true);
      });
  });


  describe('Service: Node - move child node', function() {
    let node;
    beforeEach(function() {
      node = {
        childNodes: [{
          type: 'n1'
        }, {
          type: 'n2'
        }, {
          type: 'n3'
        }]
      };
    });

    it('moveChildNode left should move node left',
      function() {
        TreeNode.moveChildNode(node, node.childNodes[1], true);
        expect(node).toEqual({
          childNodes: [{
            type: 'n2'
          }, {
            type: 'n1'
          }, {
            type: 'n3'
          }]
        });
      });

    it('moveChildNode right should move node right',
      function() {
        TreeNode.moveChildNode(node, node.childNodes[1], false);
        expect(node).toEqual({
          childNodes: [{
            type: 'n1'
          }, {
            type: 'n3'
          }, {
            type: 'n2'
          }]
        });
      });


    it('canMoveChildNode left should return false for top child node',
      function() {
        expect(TreeNode.canMoveChildNode(node, node.childNodes[0], true)).toBe(false);
      });

    it('canMoveChildNode right should return false for bottom child node',
      function() {
        expect(TreeNode.canMoveChildNode(node, node.childNodes[2], false)).toBe(false);
      });

    it('canMoveChildNode left should return true for non top child node',
      function() {
        expect(TreeNode.canMoveChildNode(node, node.childNodes[1], true)).toBe(true);
        expect(TreeNode.canMoveChildNode(node, node.childNodes[2], true)).toBe(true);
      });

    it('canMoveChildNode right should return true for non bottom child node',
      function() {
        expect(TreeNode.canMoveChildNode(node, node.childNodes[0], false)).toBe(true);
        expect(TreeNode.canMoveChildNode(node, node.childNodes[1], true)).toBe(true);
      });

  });
});
