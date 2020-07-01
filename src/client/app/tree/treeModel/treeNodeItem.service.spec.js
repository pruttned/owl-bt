'use strict';

describe('Service: TreeNodeItem', function () {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  // instantiate service
  let TreeNodeItem;
  beforeEach(() => inject(function (_TreeNodeItem_) {
    TreeNodeItem = _TreeNodeItem_;
  }));

  it('resolvedPropertyObj should return plain object with all properties', function () {
    let item = {
      properties: {
        prop1: 'value1'
      },
      $meta: {
        desc: {
          properties: [{
            name: 'prop1',
            default: 'prop1-def'
          }, {
            name: 'prop2',
            default: 'prop2-def'
          }, {
            name: 'prop3'
          }]
        }
      }
    };
    let res = TreeNodeItem.resolvedPropertyObj(item);
    expect(res.prop1).toBe('value1');
    expect(res.prop2).toBe('prop2-def');
    expect(res.prop3).toBeUndefined();
  });


});
