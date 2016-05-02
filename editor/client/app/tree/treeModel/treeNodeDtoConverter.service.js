'use strict';

(function() {

  /**
   * Converts node (tree) to dto
   */
  class TreeNodeDtoConverter {

    convert(node) {
      let dto = {};
      angular.extend(dto, node);

      delete dto._meta;

      if (dto.properties) {
        dto.properties = this._convertProperties(dto.properties);
        if (_.isEmpty(dto.properties)) {
          delete dto.properties;
        }
      }
      if (dto.decorators) {
        dto.decorators = dto.decorators.map(d => this._convertSubItem(d));
      }
      if (dto.services) {
        dto.services = dto.services.map(s => this._convertSubItem(s));
      }
      if (dto.childNodes) {
        dto.childNodes = dto.childNodes.map(n => this.convert(n));
      }

      this._clearEmptyArrays(dto);

      return dto;
    }

    _convertProperties(propsObj) {
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

    _convertSubItem(item) {
      let dto = {};
      angular.extend(dto, item);
      this._clearEmptyArrays(dto);
      if (dto.properties) {
        dto.properties = this._convertProperties(dto.properties);
        if (_.isEmpty(dto.properties)) {
          delete dto.properties;
        }
      }
      return dto;
    }

    _clearEmptyArrays(obj) {
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          let value = obj[prop];
          if (value && _.isArray(value) && !value.length) {
            delete obj[prop];
          }
        }
      }
    }

  }

  angular.module('editorApp')
    .service('TreeNodeDtoConverter', TreeNodeDtoConverter);

})();
