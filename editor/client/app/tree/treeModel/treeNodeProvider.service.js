'use strict';

(function() {

  class TreeNodeProvider {
    constructor(IdProvider, TreeItemPropertyDtoConverter, TreeDecoratorItemProvider, TreeServiceItemProvider) {
        this._idProvider = IdProvider;
        this._treeItemPropertyDtoConverter = TreeItemPropertyDtoConverter;
        this._treeDecoratorItemProvider = TreeDecoratorItemProvider;
        this._treeServiceItemProvider = TreeServiceItemProvider;
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
      node.decorators = node.decorators ? node.decorators.map(d => this._treeDecoratorItemProvider.create(d)) : [];
      node.services = node.services ? node.services.map(s => this._treeServiceItemProvider.create(s)) : [];
      node.childNodes = node.childNodes ? node.childNodes.map(n => this.create(n)) : [];

      return node;
    }
  }

  angular.module('editorApp')
    .service('TreeNodeProvider', TreeNodeProvider);

})();
