'use strict';

describe('Service: TreeMruList', function () {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  //local storage mock  - http://stackoverflow.com/a/14381941
  beforeEach(() => {
    let store = {
      'TreeMruList.items': JSON.stringify([{
        path: 'url1'
      }, {
        path: 'url2'
      }, {
        path: 'url3'
      }])
    };
    
    //https://stackoverflow.com/a/54157998
    spyOn(window.localStorage.__proto__, 'getItem').and.callFake(function (key) {
      return store[key];
    });
    spyOn(window.localStorage.__proto__, 'setItem').and.callFake(function (key, value) {
      store[key] = value;
    });
    spyOn(window.localStorage.__proto__, 'clear').and.callFake(function () {
      store = {};
    });
  });

  // instantiate service
  let TreeMruList;
  beforeEach(() => inject(function (_TreeMruList_) {
    TreeMruList = _TreeMruList_;
  }));

  it('register should add item to beginning',
    function () {
      TreeMruList.register('newItem1');
      const items = TreeMruList.getList();
      expect(items[0].path).toBe('newItem1');
    });

  it('register should move existing item after registration to beginning',
    function () {
      TreeMruList.register('url2');
      const items = TreeMruList.getList();
      // expect(items.length).toBe(3);
      expect(items[0].path).toBe('url2');
      expect(items[1].path).toBe('url1');
      expect(items[2].path).toBe('url3');
    });

  it('register should remove last used item if cnt exceeds max cnt',
    function () {
      const startItemCnt = TreeMruList.getList().length;
      for (let i = 0; i < TreeMruList.maxItemCnt - startItemCnt + 1; ++i) {
        TreeMruList.register(`x-${i}`);
      }
      const items = TreeMruList.getList();
      expect(items.length).toBe(TreeMruList.maxItemCnt);
      expect(items[items.length - 1].path).toBe('url2');
    });
});
