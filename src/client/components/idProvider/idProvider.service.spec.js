'use strict';

describe('Service: IdProvider', function() {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  // instantiate service
  let IdProvider;
  beforeEach(() => inject(function(_IdProvider_) {
    IdProvider = _IdProvider_;
  }));

  it('calls to newId should generate int sequence starting with 1', function() {
    expect(IdProvider.newId()).toBe(1);
    expect(IdProvider.newId()).toBe(2);
    expect(IdProvider.newId()).toBe(3);
  });
});
