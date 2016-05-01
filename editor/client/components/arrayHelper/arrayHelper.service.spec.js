'use strict';

describe('Service: ArrayHelper', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  // instantiate service
  let ArrayHelper;
  beforeEach(inject(function(_ArrayHelper_) {
    ArrayHelper = _ArrayHelper_;
  }));

  let items;
  beforeEach(function() {
    items = [{
      id: 1
    }, {
      id: 2
    }, {
      id: 3
    }];
  });


  it('moveLeft should return false and do nothing when moving left most item to left', function() {
    let res = ArrayHelper.moveLeft(items, items[0]);
    expect(res).toBe(false);
    expect(items[0].id).toBe(1);
    expect(items[1].id).toBe(2);
    expect(items[2].id).toBe(3);
  });
  it('moveRight should return false and do nothing when moving right most item to right', function() {
    let res = ArrayHelper.moveRight(items, items[2]);
    expect(res).toBe(false);
    expect(items[0].id).toBe(1);
    expect(items[1].id).toBe(2);
    expect(items[2].id).toBe(3);
  });
  it('moveLeft should return true and move item to left', function() {
    let res = ArrayHelper.moveLeft(items, items[1]);
    expect(res).toBe(true);
    expect(items[0].id).toBe(2);
    expect(items[1].id).toBe(1);
    expect(items[2].id).toBe(3);
  });
  it('moveLeft should return true and move item to right', function() {
    let res = ArrayHelper.moveRight(items, items[1]);
    expect(res).toBe(true);
    expect(items[0].id).toBe(1);
    expect(items[1].id).toBe(3);
    expect(items[2].id).toBe(2);
  });
  it('remove should return false and do nothing when removing item that is not in the array', function() {
    let res = ArrayHelper.remove(items, {id:1});
    expect(res).toBe(false);
    expect(items.length).toBe(3);
    expect(items[0].id).toBe(1);
    expect(items[1].id).toBe(2);
    expect(items[2].id).toBe(3);
  });
  it('remove should return true remove item in the array', function() {
    let res = ArrayHelper.remove(items, items[1]);
    expect(res).toBe(true);
    expect(items.length).toBe(2);
    expect(items[0].id).toBe(1);
    expect(items[1].id).toBe(3);
  });
  it('contains should return false for item that is not in the array', function() {
    let res = ArrayHelper.remove(items, {id:1});
    expect(res).toBe(false);
  });
  it('contains should return true for item that is in the array', function() {
    let res = ArrayHelper.remove(items, items[1]);
    expect(res).toBe(true);
  });
});
