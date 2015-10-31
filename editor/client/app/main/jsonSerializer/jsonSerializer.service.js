'use strict';

angular.module('editorApp')
  /**
   * JSON serializer.
   * Ignores specific properties when serializing.
   */
  .service('JsonSerializer', function(_) {

    /**
     * Serializes an object into a JSON string.
     * All properties whose names start with '$' are not included in the resulting JSON.
     * @param  {Object} object - the object to serialize
     * @return {String}        - the serialized JSON string
     */
    this.serialize = function(object) {
      return JSON.stringify(object, replacer);
    };

    /**
     * Deserializes a JSON string into an object.
     * @param  {String} jsonString - the JSON string to deserialize
     * @return {Object}            - the deserialized object
     */
    this.deserialize = function(jsonString) {
      return JSON.parse(jsonString);
    };

    function replacer(key, value) {
      if (_.isString(key) && //initially the replacer gets called with an empty key --MDN ; for array, each item has index key
        key.substr(0, 1) === '$') { //internal or temporary properties

        return undefined; //won`t be included in the resulting JSON
      }
      return value;
    }
  });
