'use strict';

(function() {

  class TreeNodeProvider {
    constructor(IdProvider, TreeItemPropertyDtoConverter) {
        this._idProvider = IdProvider;
        this._treeItemPropertyDtoConverter = TreeItemPropertyDtoConverter;
      }
      /**
       * Creates a node
       * @param  {Object} dto - node dto
       * @param  {Object} dto.type - node type
       * @param  {Object} dto...
       * @return {Object} - Node
       */
    create(dto) {
      let node = {};
      node.type = node.type || 'unknown';
      angular.extend(node, dto);
      node._meta = {
        id: this._idProvider.newId(),
        version: 1
      };
      node.properties = this._treeItemPropertyDtoConverter.convertFromDto(node.properties);
      node.decorators = node.decorators ? node.decorators.map(d => this._convertSubItem(d)) : [];
      node.services = node.services ? node.services.map(s => this._convertSubItem(s)) : [];
      node.childNodes = node.childNodes ? node.childNodes.map(n => this.create(n)) : [];

      return node;
    }

    _convertProperties(propsDto) {
      let propsObj = {};
      if (propsDto) {
        for (let prop of propsDto) {
          propsObj[prop.name] = prop.value;
        }
      }
      return propsObj;
    }

    _convertSubItem(dto) {
      let item = {};
      angular.extend(item, dto);
      item.type = item.type || 'unknown';
      item.properties = this._treeItemPropertyDtoConverter.convertFromDto(item.properties);
      return item;
    }
  }

  angular.module('editorApp')
    .service('TreeNodeProvider', TreeNodeProvider);

})();
