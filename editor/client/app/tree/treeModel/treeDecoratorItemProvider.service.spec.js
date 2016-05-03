'use strict';

describe('Service: TreeDecoratorItemProvider', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  // instantiate service
  let TreeDecoratorItemProvider;
  beforeEach(inject(function(_TreeDecoratorItemProvider_) {
    TreeDecoratorItemProvider = _TreeDecoratorItemProvider_;
  }));

  it('create should clone provided dto + convert all property collections', function() {
    let dto = {
      type: 'd1',
      properties: [{
        name: 'prop1',
        value: 'value1'
      }]
    };
    let node = TreeDecoratorItemProvider.create(dto);
    expect(node).not.toBe(dto);
    expect(node).toEqual({
      type: 'd1',
      properties: {
        prop1: 'value1'
      }
    });
  });
});
