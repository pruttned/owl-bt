'use strict';

describe('Service: TreeNodeProvider', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  beforeEach(module('mocks.ProjectStore'));

  // instantiate service
  let TreeNodeProvider;
  beforeEach(inject(function(_TreeNodeProvider_) {
    TreeNodeProvider = _TreeNodeProvider_;
  }));

  it('create should clone provided dto and all its subnodes+subitems + convert all property collections and add version/id meta inf',
    function() {
      let dto = {
        type: 'sequence',
        decorators: [{
          type: 'd1',
          properties: [{
            name: 'prop1',
            value: 'value1'
          }, {
            name: 'prop2',
            value: 'value2'
          }]
        }],
        services: [{
          type: 's1',
          properties: [{
            name: 'prop1',
            value: 'value1'
          }, {
            name: 'prop2',
            value: 'value2'

          }]
        }],
        childNodes: [{
          type: 'chn1',
          properties: [{
            name: 'prop1',
            value: 'value1'
          }, {
            name: 'prop2',
            value: 'value2'
          }]
        }]
      };
      let node = TreeNodeProvider.create(dto);

      expect(node).not.toBe(dto);
      expect(node.decorators[0]).not.toBe(dto.decorators[0]);
      expect(node.services[0]).not.toBe(dto.services[0]);
      expect(node.childNodes[0]).not.toBe(dto.childNodes[0]);

      expect(node).toEqual({
        type: 'sequence',
        $meta: {
          id: 1,
          version: 1,
          desc: 'sequence'
        },
        properties: {},
        decorators: [{
          type: 'd1',
          properties: {
            prop1: 'value1',
            prop2: 'value2'
          },
          $meta: {
            desc: 'd1'
          }
        }],
        services: [{
          type: 's1',
          properties: {
            prop1: 'value1',
            prop2: 'value2'
          },
          $meta: {
            desc: 's1'
          }
        }],
        childNodes: [{
          type: 'chn1',
          $meta: {
            id: 2,
            version: 1,
            desc: 'chn1'
          },
          properties: {
            prop1: 'value1',
            prop2: 'value2'
          }
        }]
      });
    });
});
