'use strict';

describe('Service: ProjectStore', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  // local storage mock  - http://stackoverflow.com/a/14381941
  beforeEach(function() {
    let store = {
      'ProjectStore.projects': JSON.stringify([{
        path: 'url1'
      }, {
        path: 'url2'
      }, {
        path: 'url3'
      }])
    };
    spyOn(localStorage, 'getItem').andCallFake(function(key) {
      return store[key];
    });
    spyOn(localStorage, 'setItem').andCallFake(function(key, value) {
      store[key] = value + '';
    });
    spyOn(localStorage, 'clear').andCallFake(function() {
      store = {};
    });
  });

  // instantiate service
  let ProjectStore;
  beforeEach(inject(function(_ProjectStore_) {
    ProjectStore = _ProjectStore_;
  }));

  it('Projects are loaded from the store', function() {
    expect(ProjectStore.projects.length).toBe(3);
    expect(ProjectStore.projects).toContain({path:'url1'});
    expect(ProjectStore.projects).toContain({path:'url2'});
    expect(ProjectStore.projects).toContain({path:'url3'});
  });

  it('Added project is added to store', function() {
    ProjectStore.addProject({path:'newUrl'});

    expect(ProjectStore.projects.length).toBe(4);
    expect(ProjectStore.projects).toContain({path:'url1'});
    expect(ProjectStore.projects).toContain({path:'url2'});
    expect(ProjectStore.projects).toContain({path:'url3'});
    expect(ProjectStore.projects).toContain({path:'newUrl'});
  });

  it('Removed project by url is removed from store', function() {
    ProjectStore.removeProject('url2');

    expect(ProjectStore.projects.length).toBe(2);
    expect(ProjectStore.projects).toContain({path:'url1'});
    expect(ProjectStore.projects).toContain({path:'url3'});
  });

  it('Removed project by instance is removed from store', function() {
    expect(ProjectStore.removeProject(ProjectStore.projects[1])).toBe(true);


    expect(ProjectStore.projects.length).toBe(2);
    expect(ProjectStore.projects).toContain({path:'url1'});
    expect(ProjectStore.projects).toContain({path:'url3'});
  });

  it('Removing nonexistent project doesn`t change anything', function() {
    expect(ProjectStore.removeProject('nonexistent_prj')).toBe(false);

    expect(ProjectStore.projects.length).toBe(3);
    expect(ProjectStore.projects).toContain({path:'url1'});
    expect(ProjectStore.projects).toContain({path:'url2'});
    expect(ProjectStore.projects).toContain({path:'url3'});
  });
});
