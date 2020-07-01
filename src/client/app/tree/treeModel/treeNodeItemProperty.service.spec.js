'use strict';

describe('Service: TreeNodeItemProperty', function () {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  // instantiate service
  let TreeNodeItemProperty;
  beforeEach(() => inject(function (_TreeNodeItemProperty_) {
    TreeNodeItemProperty = _TreeNodeItemProperty_;
  }));

  it('isSet should return true if properties object contains the specified property', function () {
    let item = {
      properties: {
        prop1: 'value1'
      }
    };
    let res = TreeNodeItemProperty.isSet(item, 'prop1');
    expect(res).toBe(true);
  });

  it('isSet should return false if properties object contains the specified property', function () {
    let item = {
      properties: {
        prop1: 'value1'
      }
    };
    let res = TreeNodeItemProperty.isSet(item, 'prop1XX');
    expect(res).toBe(false);
  });

  it('value should return default value for unset property', function () {
    let item = {
      properties: {
        propXX: 'value1'
      },
      $meta: {
        desc: {
          properties: [{
            name: 'prop1',
            default: 'def1'
          }]
        }
      }
    };
    let res = TreeNodeItemProperty.value(item, 'prop1');
    expect(res).toBe('def1');
  });

  it('value should return value for set property', function () {
    let item = {
      properties: {
        prop1: 'value1'
      },
      $meta: {
        desc: {
          properties: [{
            name: 'prop1',
            default: 'def1'
          }]
        }
      }
    };
    let res = TreeNodeItemProperty.value(item, 'prop1');
    expect(res).toBe('value1');
  });

  it('value should set value for unset property', function () {
    let item = {
      $meta: {
        desc: {
          properties: [{
            name: 'prop1',
            default: 'def1',
            type: 'string'
          }]
        }
      }
    };
    TreeNodeItemProperty.value(item, 'prop1', 'newValue1');
    expect(item.properties.prop1).toBe('newValue1');
  });

  it('value should set value for set property', function () {
    let item = {
      properties: {
        prop1: 'value1'
      },
      $meta: {
        desc: {
          properties: [
            {
              name: 'prop1',
              type: 'string'
            }
          ]
        }
      }
    };
    TreeNodeItemProperty.value(item, 'prop1', 'newValue1');
    expect(item.properties.prop1).toBe('newValue1');
  });

  it('reset should remove property and also remove properties obj if empty', function () {
    let item = {
      properties: {
        prop1: 'value1'
      }
    };
    TreeNodeItemProperty.reset(item, 'prop1');
    expect(item.properties).not.toBeDefined();
  });

  it('reset should remove property and not remove properties obj if not empty', function () {
    let item = {
      properties: {
        prop1: 'value1',
        prop2: 'value2'
      }
    };
    TreeNodeItemProperty.reset(item, 'prop1');
    expect(item.properties).toBeDefined();
    expect(item.properties.prop1).not.toBeDefined();
  });

  it('desc should return desc obj', function () {
    let item = {
      properties: {
        prop1: 'value1'
      },
      $meta: {
        desc: {
          properties: [{
            name: 'prop1',
            default: 'def1'
          }]
        }
      }
    };
    var res = TreeNodeItemProperty.desc(item, 'prop1');
    expect(res).toBe(item.$meta.desc.properties[0]);
  });

  it('default should return default property value', function () {
    let item = {
      properties: {
        prop1: 'value1'
      },
      $meta: {
        desc: {
          properties: [{
            name: 'prop1',
            default: 'def1'
          }]
        }
      }
    };
    var res = TreeNodeItemProperty.default(item, 'prop1');
    expect(res).toBe('def1');
  });

});
