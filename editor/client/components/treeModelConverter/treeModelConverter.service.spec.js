'use strict';

describe('Service: TreeModelConverter', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  // instantiate service
  let TreeModelConverter;
  beforeEach(inject(function(_TreeModelConverter_) {
    TreeModelConverter = _TreeModelConverter_;
  }));

  it('convertPropertiesToRuntime should convert property array to object', function() {
    let res = TreeModelConverter.convertPropertiesToRuntime([{
      name: 'prop1',
      value: 'value1'
    }, {
      name: 'prop2',
      value: 'value2'
    }]);
    expect(res).toEqual({
      prop1: 'value1',
      prop2: 'value2'
    });
  });

  it('convertSubItemToRuntime should clone subitem and convert its properties', function() {
    let item = {
      type: 'type',
      properties: [{
        name: 'prop1',
        value: 'value1'
      }, {
        name: 'prop2',
        value: 'value2'
      }]
    };
    let res = TreeModelConverter.convertSubItemToRuntime(item);
    expect(res).not.toBe(item);
    expect(res).toEqual({
      type: 'type',
      properties: {
        prop1: 'value1',
        prop2: 'value2'
      }
    });
  });

  it('convertNodeToRuntime should clone node and all its subnodes+subitems; convert all property collections and add version+id meta inf', function() {
    let node = {
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
    let res = TreeModelConverter.convertNodeToRuntime(node);
    expect(res).not.toBe(node);
    expect(res.decorators[0]).not.toBe(node.decorators[0]);
    expect(res.services[0]).not.toBe(node.services[0]);
    expect(res.childNodes[0]).not.toBe(node.childNodes[0]);
    expect(res).toEqual({
      type: 'sequence',
      _meta: {
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
        _meta: {
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
    });
  });
});
