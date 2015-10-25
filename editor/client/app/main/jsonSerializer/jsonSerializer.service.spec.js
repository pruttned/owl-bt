'use strict';



//TODO




/*
describe('Service: ProjectStore', function () {

  // load the service's module
  beforeEach(module('editorApp'));

  // instantiate service
  var ProjectStore;
  beforeEach(inject(function (_ProjectStore_) {
    ProjectStore = _ProjectStore_;
  }));

  it('should do something', function () {
    expect(!!ProjectStore).toBe(true);
  });

});
*/







/*
//---DATA---
var objectWithNoIgnoredProperties = {
  one: 'one value',
  two: 'two value',
  three: 'three value',
  four: 'four value',
}

var objectWithSomeIgnoredProperties = {
  one: 'one value',
  $two: 'two value',
  three: 'three value',
  $$four: 'four value',
}

var objectWithSomeIgnoredPropertiesResult = {
  one: 'one value',
  three: 'three value',
}

var objectWithAllIgnoredProperties = {
  $one: 'one value',
  $two: 'two value',
  $three: 'three value',
  $four: 'four value',
}

var objectWithAllIgnoredPropertiesResult = {
}

var jsonToDeserialize = '{"one": "one value", "two": "two value"}';
var deserializedObject = {one: "one value", two: "two value"};

//---TESTS---
var serializer = new JsonSerializer();

//#1
//An object with no properties to ignore should have no properties ignored.
testSerialize(objectWithNoIgnoredProperties, objectWithNoIgnoredProperties);

//#2
//An object with some properties to ignore should have these properties ignored.
testSerialize(objectWithSomeIgnoredProperties, objectWithSomeIgnoredPropertiesResult);

//#3
//An object with all properties to ignore should be serialized empty.
testSerialize(objectWithAllIgnoredProperties, objectWithAllIgnoredPropertiesResult);

//#4
//A deserialized JSON should be equivalent to the original JSON.
{
  var objectFromJson = serializer.deserialize(jsonToDeserialize);
  var success = areObjectsEqual(objectFromJson, deserializedObject);
  console.log(success);
}

//---HELPERS---
function testSerialize(objectToSerialize, resultingObject) {
  var json = serializer.serialize(objectToSerialize);
  var objectFromJson = JSON.parse(json);
  var success = areObjectsEqual(objectFromJson, resultingObject);
  console.log(success);
}

function areObjectsEqual(firstObject, secondObject) {
  if(Object.keys(firstObject).length !== Object.keys(secondObject).length) {
    return false;
  }

  for(property in firstObject) {
    if(!secondObject.hasOwnProperty(property) ||
       firstObject[property] !== secondObject[property]) {
      return false;
    }
  }
  return true;
}
 */
