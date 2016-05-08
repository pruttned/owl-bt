'use strict';

(function() {

  class TreeDecoratorItemProvider {
    constructor(IdProvider, TreeItemPropertyDtoConverter) {
        this._idProvider = IdProvider;
        this._treeItemPropertyDtoConverter = TreeItemPropertyDtoConverter;
      }

    create(dto, projectModel) {
      let decorator = {};
      angular.extend(decorator, dto);
      decorator.type = decorator.type || 'unknown';
      decorator._meta = {
        desc : projectModel.getDecoratorTypeDesc(decorator.type)
      };
      decorator.properties = this._treeItemPropertyDtoConverter.convertFromDto(decorator.properties);
      return decorator;
    }
  }

  angular.module('editorApp')
    .service('TreeDecoratorItemProvider', TreeDecoratorItemProvider);
})();
