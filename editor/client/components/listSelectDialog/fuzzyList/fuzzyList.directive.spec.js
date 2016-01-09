'use strict';

//TODO

describe('Directive: fuzzyList', function () {


  // load the directive's module and view
  beforeEach(module('editorApp'));
  beforeEach(module('app/fuzzyList/fuzzyList.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('TODO', inject(function ($compile) {
    element = angular.element('<fuzzy-list></fuzzy-list>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the fuzzyList directive');
  }));
});
