'use strict';

describe('Service: TreeServiceItemProvider', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  // instantiate service
  let TreeServiceItemProvider;
  beforeEach(inject(function(_TreeServiceItemProvider_) {
    TreeServiceItemProvider = _TreeServiceItemProvider_;
  }));

  it('create should clone provided dto + convert all property collections', function() {
    let dto = {
      type: 'd1',
      properties: [{
        name: 'prop1',
        value: 'value1'
      }]
    };
    let node = TreeServiceItemProvider.create(dto);
    expect(node).not.toBe(dto);
    expect(node).toEqual({
      type: 'd1',
      properties: {
        prop1: 'value1'
      }
    });
  });
});
