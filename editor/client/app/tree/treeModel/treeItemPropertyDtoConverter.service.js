'use strict';

(function() {

  class TreeItemPropertyDtoConverter {
    convertToDto(propsObj) {
      let propsArray = [];
      if (propsObj) {
        for (let prop in propsObj) {
          if (propsObj.hasOwnProperty(prop)) {
            propsArray.push({
              name: prop,
              value: propsObj[prop]
            });
          }
        }
      }
      return propsArray;
    }

    convertFromDto(propsDto) {
      let propsObj = {};
      if (propsDto) {
        for (let prop of propsDto) {
          propsObj[prop.name] = prop.value;
        }
      }
      return propsObj;
    }
  }
  
  angular.module('editorApp')
    .service('TreeItemPropertyDtoConverter', TreeItemPropertyDtoConverter);

})();
