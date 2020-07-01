'use strict';

describe('Service: TreeItemPropertyDtoConverter', function() {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  // instantiate service
  let TreeItemPropertyDtoConverter;
  beforeEach(() => inject(function(_TreeItemPropertyDtoConverter_) {
    TreeItemPropertyDtoConverter = _TreeItemPropertyDtoConverter_;
  }));


  it('convertFromDto should convert property array to object', function() {
    let res = TreeItemPropertyDtoConverter.convertFromDto([{
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

  it('convertToDto should convert property object to array', function() {
    let res = TreeItemPropertyDtoConverter.convertToDto({
      prop1: 'value1',
      prop2: 'value2'
    });
    expect(res).toEqual([{
      name: 'prop1',
      value: 'value1'
    }, {
      name: 'prop2',
      value: 'value2'
    }]);
  });
});
