'use strict';

describe('Service: ProjectStore', function () {

  // load the service's module
  beforeEach(module('editorApp'));

  // instantiate service
  var ProjectStore;
  beforeEach(inject(function (_ProjectStore_) {
    ProjectStore = _ProjectStore_;
  }));

  it('should do something', function () {
    expect(!!ProjectStore).toBe(true);
  });

});
