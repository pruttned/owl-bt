'use strict';

describe('Service: TreeNodeDtoConverter', function() {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  // instantiate service
  let TreeNodeDtoConverter;
  beforeEach(() => inject(function(_TreeNodeDtoConverter_) {
    TreeNodeDtoConverter = _TreeNodeDtoConverter_;
  }));

  it('convert should clone node and all its subnodes+subitems; convert all property collections and remove meta inf + remove empty arrays/properties', function() {
    let node = {
      type: 'sequence',
      $meta: {
        id: 1,
        version: 1
      },
      properties: {},
      decorators: [{
        type: 'd1',
        properties: {
          prop1: 'value1',
          prop2: 'value2'
        }
      }],
      services: [{
        type: 's1',
        properties: {
          prop1: 'value1',
          prop2: 'value2'
        }
      }],
      childNodes: [{
        type: 'chn1',
        $meta: {
          id: 2,
          version: 1
        },
        properties: {
          prop1: 'value1',
          prop2: 'value2'
        },
        decorators: [],
        services: [],
        childNodes: []
      }]
    };
    let res = TreeNodeDtoConverter.convert(node);
    expect(res).not.toBe(node);
    expect(res.decorators[0]).not.toBe(node.decorators[0]);
    expect(res.services[0]).not.toBe(node.services[0]);
    expect(res.childNodes[0]).not.toBe(node.childNodes[0]);
    expect(res).toEqual({
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
    });
  });



});
