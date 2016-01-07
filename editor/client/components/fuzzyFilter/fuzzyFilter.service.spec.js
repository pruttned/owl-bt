'use strict';

describe('Service: FuzzyFilter', function () {

  // load the service's module
  beforeEach(module('editorApp'));

  // instantiate service
  let FuzzyFilter;
  beforeEach(inject(function (_FuzzyFilter_) {
    FuzzyFilter = _FuzzyFilter_;
  }));

  let items = ['house', 'car house', 'car ho'];

  it('filter should return items containing the specified filter string', function () {
    let res = FuzzyFilter.filter(items, 'house');
    expect(res.length).toBe(2);
    for (var i = 0; i < res.length; i++) {
      expect(res[i].text.indexOf('house')).toBeGreaterThan(-1);
    }
  });

  it('filter should return items ordered by score', function () {
    let res = FuzzyFilter.filter(items, 'house');
    expect(res.length).toBe(2);
    expect(res[0].score).toBeGreaterThan(res[1].score);
  });

  it('perfect match should be first', function () {
    let res = FuzzyFilter.filter(items, 'house');
    expect(res[0].text).toBe('house');
  });

});
