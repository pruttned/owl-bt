'use strict';

describe('Service: TreeDecoratorItemProvider', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  beforeEach(module('mocks.ProjectStore'));

  // instantiate service
  let TreeDecoratorItemProvider;
  let $scope;
  beforeEach(inject(function($rootScope, _TreeDecoratorItemProvider_) {
    TreeDecoratorItemProvider = _TreeDecoratorItemProvider_;
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
      TreeDecoratorItemProvider.create(dto)
        .then(dec => {
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
          done();
        });

      $scope.$apply(); //resolve promises
    });
});
