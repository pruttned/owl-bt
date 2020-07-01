'use strict';

describe('Service: TreeServiceItemProvider', function() {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  beforeEach(() => angular.mock.module('mocks.ProjectStore'));

  // instantiate service
  let TreeServiceItemProvider;
  beforeEach(() => inject(function(_TreeServiceItemProvider_) {
    TreeServiceItemProvider = _TreeServiceItemProvider_;
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
      let svc = TreeServiceItemProvider.create(dto);
      expect(svc).not.toBe(dto);
      expect(svc).toEqual({
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
