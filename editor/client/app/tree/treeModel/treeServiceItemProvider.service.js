'use strict';

(function() {

  class TreeServiceItemProvider {
    constructor(IdProvider, TreeItemPropertyDtoConverter) {
        this._idProvider = IdProvider;
        this._treeItemPropertyDtoConverter = TreeItemPropertyDtoConverter;
      }

    create(dto, projectModel) {
      let service = {};
      angular.extend(service, dto);
      service.type = service.type || 'unknown';
      service._meta = {
        desc : projectModel.getServiceTypeDesc(service.type)
      };
      service.properties = this._treeItemPropertyDtoConverter.convertFromDto(service.properties);
      return service;
    }
  }

  angular.module('editorApp')
    .service('TreeServiceItemProvider', TreeServiceItemProvider);
})();
