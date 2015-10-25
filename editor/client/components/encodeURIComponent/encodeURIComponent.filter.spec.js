'use strict';

describe('Filter: encodeURIComponent', function () {

  // load the filter's module
  beforeEach(module('editorApp'));

  // initialize a new instance of the filter before each test
  var encodeURIComponent;
  beforeEach(inject(function ($filter) {
    encodeURIComponent = $filter('encodeURIComponent');
  }));

  it('should return the input prefixed with "encodeURIComponent filter:"', function () {
    var text = 'angularjs';
    expect(encodeURIComponent(text)).toBe('encodeURIComponent filter: ' + text);
  });

});
