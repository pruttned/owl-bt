'use strict';

describe('Service: TreeDecoratorItemProvider', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  // instantiate service
  let TreeDecoratorItemProvider;
  beforeEach(inject(function(_TreeDecoratorItemProvider_) {
    TreeDecoratorItemProvider = _TreeDecoratorItemProvider_;
  }));

  let projectModel;
  beforeEach(function() {
    projectModel = window.owlBtMocks.createProjectModelMock();
  });

  it('create should clone provided dto + convert all property collections and generate _meta', function() {
    let dto = {
      type: 'd1',
      properties: [{
        name: 'prop1',
        value: 'value1'
      }]
    };
    let node = TreeDecoratorItemProvider.create(dto, projectModel);
    expect(node).not.toBe(dto);
    expect(node).toEqual({
      type: 'd1',
      properties: {
        prop1: 'value1'
      },
      _meta: {
        desc: 'd1'
      }
    });
  });
});
