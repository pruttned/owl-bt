'use strict';

(function() {

  /**
   * Converts node (tree) to dto
   */
  class TreeNodeDtoConverter {

    constructor(TreeItemPropertyDtoConverter){
      this._TreeItemPropertyDtoConverter = TreeItemPropertyDtoConverter;
    }

    convert(node) {
      let dto = {};
      angular.extend(dto, node);

      delete dto.$meta;

      if (dto.properties) {
        dto.properties = this._TreeItemPropertyDtoConverter.convertToDto(dto.properties);
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

    _convertSubItem(item) {
      let dto = {};
      angular.extend(dto, item);
      this._clearEmptyArrays(dto);
      delete dto.$meta;
      if (dto.properties) {
        dto.properties = this._TreeItemPropertyDtoConverter.convertToDto(dto.properties);
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
