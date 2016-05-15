'use strict';

(function() {

  class TreeDecoratorItemProvider {
    constructor(ProjectStore, IdProvider, TreeItemPropertyDtoConverter) {
      this._projectStore = ProjectStore;
      this._idProvider = IdProvider;
      this._treeItemPropertyDtoConverter = TreeItemPropertyDtoConverter;
    }

    create(dto) {
      return this._projectStore.getDecoratorTypeDesc(dto.type)
        .then(desc => {
          let decorator = {};
          angular.extend(decorator, dto);
          decorator.type = decorator.type || 'unknown';
          decorator.$meta = {
            desc: desc
          };
          decorator.properties = this._treeItemPropertyDtoConverter.convertFromDto(decorator.properties);
          return decorator;
        });
    }
  }

  angular.module('editorApp')
    .service('TreeDecoratorItemProvider', TreeDecoratorItemProvider);
})();
