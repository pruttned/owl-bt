'use strict';

describe('Service: TreeDecoratorItemProvider', function() {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  beforeEach(() => angular.mock.module('mocks.ProjectStore'));

  // instantiate service
  let TreeDecoratorItemProvider;
  beforeEach(() => inject(function(_TreeDecoratorItemProvider_) {
    TreeDecoratorItemProvider = _TreeDecoratorItemProvider_;
  }));

  it('create should clone provided dto + convert all property collections and generate $meta',
    function() {
      let dto = {
        type: 'd1',
        properties: [{
          name: 'prop1',
          value: 'value1'
        }]
      };
      let dec = TreeDecoratorItemProvider.create(dto);
      expect(dec).not.toBe(dto);
      expect(dec).toEqual({
        type: 'd1',
        properties: {
          prop1: 'value1'
        },
        $meta: {
          desc: 'd1'
        }
      });
    });

});
