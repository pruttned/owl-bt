'use strict';

describe('Service: JsonSerializer', function() {

  // load the service's module
  beforeEach(module('editorApp'));

  // instantiate service
  var JsonSerializer;
  beforeEach(inject(function(_JsonSerializer_) {
    JsonSerializer = _JsonSerializer_;
  }));

  it('An object with no properties to ignore should have no properties ignored.', function() {
    var testObject = {
      one: 'one value',
      two: 'two value',
      three: 'three value',
      four: 'four value'
    }

    expectCorrectSerialization(testObject, testObject);
  });

  it('An object with some properties to ignore should have these properties ignored.', function() {
    var testObject = {
      one: 'one value',
      $two: 'two value',
      three: 'three value',
      $$four: 'four value',
    }

    var expectedOject = {
      one: 'one value',
      three: 'three value',
    }

    expectCorrectSerialization(testObject, expectedOject);
  });

  it('An object with all properties to ignore should be serialized empty.', function() {
    var testObject = {
      $one: 'one value',
      $two: 'two value',
      $three: 'three value',
      $four: 'four value',
    }

    var expectedOject = {}

    expectCorrectSerialization(testObject, expectedOject);
  });

  it('A deserialized JSON (object) should be equivalent to the original JSON.', function() {
    var testJson = '{"one": "one value", "two": "two value"}';
    var expectedObject = {one: "one value", two: "two value"};

    var resultingObject = JsonSerializer.deserialize(testJson);
    expect(expectedObject).toEqual(resultingObject);
  });

  function expectCorrectSerialization(testObject, expectedOject) {
    var serializedTestObject = JsonSerializer.serialize(testObject);
    var resultingObject = JSON.parse(serializedTestObject);
    expect(resultingObject).toEqual(expectedOject);
  }
});
