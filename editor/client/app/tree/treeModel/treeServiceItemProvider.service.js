'use strict';

(function() {

  class TreeServiceItemProvider {
    constructor(ProjectStore, IdProvider, TreeItemPropertyDtoConverter) {
      this._projectStore = ProjectStore;
      this._idProvider = IdProvider;
      this._treeItemPropertyDtoConverter = TreeItemPropertyDtoConverter;
    }

    create(dto) {
      let desc = this._projectStore.getServiceTypeDesc(dto.type);
      let service = {};
      angular.extend(service, dto);
      service.type = service.type || 'unknown';
      service.$meta = {
        desc: desc
      };
      service.properties = this._treeItemPropertyDtoConverter.convertFromDto(service.properties);
      return service;
    }
  }

  angular.module('editorApp')
    .service('TreeServiceItemProvider', TreeServiceItemProvider);
})();
