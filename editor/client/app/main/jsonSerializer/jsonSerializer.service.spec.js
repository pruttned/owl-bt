'use strict';

describe('Service: JsonSerializer', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  // instantiate service
  let JsonSerializer;
  beforeEach(inject(function(_JsonSerializer_) {
    JsonSerializer = _JsonSerializer_;
  }));

  it('An object with no properties to ignore should have no properties ignored.', function() {
    let testObject = {
      one: 'one value',
      two: 'two value',
      three: 'three value',
      four: 'four value'
    }

    expectCorrectSerialization(testObject, testObject);
  });

  it('An object with some properties to ignore should have these properties ignored.', function() {
    let testObject = {
      one: 'one value',
      $two: 'two value',
      three: 'three value',
      $$four: 'four value',
    }

    let expectedOject = {
      one: 'one value',
      three: 'three value',
    }

    expectCorrectSerialization(testObject, expectedOject);
  });

  it('An object with all properties to ignore should be serialized empty.', function() {
    let testObject = {
      $one: 'one value',
      $two: 'two value',
      $three: 'three value',
      $four: 'four value',
    }

    let expectedOject = {}

    expectCorrectSerialization(testObject, expectedOject);
  });

  it('A deserialized JSON (object) should be equivalent to the original JSON.', function() {
    let testJson = '{"one": "one value", "two": "two value"}';
    let expectedObject = {one: "one value", two: "two value"};

    let resultingObject = JsonSerializer.deserialize(testJson);
    expect(expectedObject).toEqual(resultingObject);
  });

  function expectCorrectSerialization(testObject, expectedOject) {
    let serializedTestObject = JsonSerializer.serialize(testObject);
    let resultingObject = JSON.parse(serializedTestObject);
    expect(resultingObject).toEqual(expectedOject);
  }
});
