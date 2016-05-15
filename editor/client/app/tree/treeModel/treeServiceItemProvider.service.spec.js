'use strict';

describe('Service: TreeServiceItemProvider', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  beforeEach(module('mocks.ProjectStore'));

  // instantiate service
  let TreeServiceItemProvider;
  let $scope;
  beforeEach(inject(function($rootScope, _TreeServiceItemProvider_) {
    TreeServiceItemProvider = _TreeServiceItemProvider_;
    $scope = $rootScope.$new();
  }));

  it('create should clone provided dto + convert all property collections and generate $meta',
    function(done) {
      let dto = {
        type: 'd1',
        properties: [{
          name: 'prop1',
          value: 'value1'
        }]
      };
      TreeServiceItemProvider.create(dto)
        .then(svc => {
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
          done();
        });

      $scope.$apply(); //resolve promises

    });
});
