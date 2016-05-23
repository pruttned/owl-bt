'use strict';

(function() {

  class TreeServiceItemProvider {
    constructor(ProjectStore, IdProvider, TreeItemPropertyDtoConverter) {
      this._ProjectStore = ProjectStore;
      this._TreeItemPropertyDtoConverter = TreeItemPropertyDtoConverter;
    }

    create(dto) {
      let desc = this._ProjectStore.getServiceTypeDesc(dto.type);
      let service = {};
      angular.extend(service, dto);
      service.type = service.type || 'unknown';
      service.$meta = {
        desc: desc
      };
      service.properties = this._TreeItemPropertyDtoConverter.convertFromDto(service.properties);
      return service;
    }
  }

  angular.module('editorApp')
    .service('TreeServiceItemProvider', TreeServiceItemProvider);
})();
