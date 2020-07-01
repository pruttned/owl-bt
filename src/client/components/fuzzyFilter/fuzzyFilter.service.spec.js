'use strict';

describe('Service: FuzzyFilter', function() {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  // instantiate service
  let FuzzyFilter;
  beforeEach(() => inject(function(_FuzzyFilter_) {
    FuzzyFilter = _FuzzyFilter_;
  }));

  let items = [{
    id: 1,
    name: 'house'
  }, {
    id: 2,
    name: 'car house'
  }, {
    id: 3,
    name: 'car ho'
  }];

  it('filter should return items containing the specified filter string', function() {
    let res = FuzzyFilter.filter(items, 'house');
    expect(res.length).toBe(2);
    for (var i = 0; i < res.length; i++) {
      expect(res[i].item.name.indexOf('house')).toBeGreaterThan(-1);
    }
  });

  it('filter should return items ordered by score', function() {
    let res = FuzzyFilter.filter(items, 'house');
    expect(res.length).toBe(2);
    expect(res[0].score).toBeGreaterThan(res[1].score);
  });

  it('filter must keep original objects in the item property', function() {
    let res = FuzzyFilter.filter(items, 'house');
    expect(res.length).toBe(2);
    expect(res[0].item.id).toBe(1);
    expect(res[1].item.id).toBe(2);
  });

  it('perfect match should be first', function() {
    let res = FuzzyFilter.filter(items, 'house');
    expect(res[0].item.name).toBe('house');
  });

});
