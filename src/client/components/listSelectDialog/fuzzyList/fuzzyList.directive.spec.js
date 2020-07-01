'use strict';

//TODO

describe('Directive: fuzzyList', function() {


  // load the directive's module and view
  beforeEach(() => angular.mock.module('editorApp'));

  var element, scope;

  beforeEach(() => inject(function($rootScope) {
    scope = $rootScope.$new();
    scope.items = [{
      name: 'item1',
      icon: 'cog'
    }, {
      name: 'item2'
    }];
    scope.onAccept = function(item) {
      scope.accpetedItem = item;
    };
  }));

  it('directive must render input box and list of items with texts and icons from input items', inject(function($compile) {
    element = angular.element('<fuzzy-list items="items"></fuzzy-list>');
    element = $compile(element)(scope);
    scope.$apply();

    expect(element.find('input').length).toBe(1);
    let liElms = element.find('li');
    expect(liElms.length).toBe(2);
    expect(liElms.eq(0).text()).toBe('item1');
    expect(liElms.eq(0).find('span.fa-cog').length).toBe(1);
    expect(liElms.eq(1).text()).toBe('item2');
  }));

  it('clicking on a item in list must execute provided onAccept function', inject(function($compile) {
    element = angular.element('<fuzzy-list items="items" on-accept="onAccept(item)"></fuzzy-list>');
    element = $compile(element)(scope);
    scope.$apply();

    let liElms = element.find('li');
    liElms.eq(0).triggerHandler('click');
    expect(scope.accpetedItem.name).toBe('item1');
  }));

  it('typing to input filters items', function(done) {
    inject(function($compile) {
        element = angular.element('<fuzzy-list items="items" on-accept="onAccept(item)"></fuzzy-list>');
        element = $compile(element)(scope);
        scope.$apply();

        element.find('input').val('i2').triggerHandler('input');

        setTimeout(function(){ //debounce
          let liElms = element.find('li');
          expect(liElms.length).toBe(1);
          expect(liElms.text()).toBe('item2');
          done();
        }, 300);
    });
  });
});
