'use strict';

(function() {

  class TreeNodeProvider {
    constructor($q, ProjectStore, IdProvider, TreeItemPropertyDtoConverter, TreeDecoratorItemProvider, TreeServiceItemProvider) {
        this._$q = $q;
        this._projectStore = ProjectStore;
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
      let _this = this;
      return this._projectStore.getNodeTypeDesc(dto.type)
        .then(desc => {
          let node = {};
          angular.extend(node, dto);
          node.type = node.type || 'unknown';
          node.$meta = {
            id: this._idProvider.newId(),
            version: 1,
            desc: desc
          };
          node.properties = this._treeItemPropertyDtoConverter.convertFromDto(node.properties);

          let decoratorsPromise = dto.decorators ? _this._$q.all(dto.decorators.map(d => _this._treeDecoratorItemProvider.create(d))) : _this._$q.when([]);
          let servicesPromise = dto.services ? _this._$q.all(dto.services.map(s => _this._treeServiceItemProvider.create(s))) : _this._$q.when([]);
          let childNodesPromise = dto.childNodes ? _this._$q.all(dto.childNodes.map(n => _this.create(n))) : _this._$q.when([]);

          return _this._$q.all([decoratorsPromise, servicesPromise, childNodesPromise])
            .then(data => {
              node.decorators = data[0];
              node.services = data[1];
              node.childNodes = data[2];
              return node;

            });
        });
    }
  }

  angular.module('editorApp')
    .service('TreeNodeProvider', TreeNodeProvider);

})();
