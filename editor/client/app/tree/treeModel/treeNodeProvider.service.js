'use strict';

(function() {

  class TreeNodeProvider {
    constructor($q, ProjectStore, IdProvider, TreeItemPropertyDtoConverter,
        TreeDecoratorItemProvider, TreeServiceItemProvider, TreeNode) {
        this._$q = $q;
        this._projectStore = ProjectStore;
        this._idProvider = IdProvider;
        this._treeItemPropertyDtoConverter = TreeItemPropertyDtoConverter;
        this._treeDecoratorItemProvider = TreeDecoratorItemProvider;
        this._treeServiceItemProvider = TreeServiceItemProvider;
        this._treeNode = TreeNode;
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
          delete node.services;
          delete node.decorators;
          delete node.childNodes;

          node.properties = this._treeItemPropertyDtoConverter.convertFromDto(node.properties);

          let decoratorsPromise = dto.decorators ? _this._$q.all(dto.decorators.map(d => _this._treeDecoratorItemProvider.create(d))) : _this._$q.when([]);
          let servicesPromise = dto.services ? _this._$q.all(dto.services.map(s => _this._treeServiceItemProvider.create(s))) : _this._$q.when([]);
          let childNodesPromise = dto.childNodes ? _this._$q.all(dto.childNodes.map(n => _this.create(n))) : _this._$q.when([]);

          return _this._$q.all([decoratorsPromise, servicesPromise, childNodesPromise])
            .then(data => {
              for (let decorator of data[0]) {
                _this._treeNode.addDecorator(node, decorator);
              }
              for (let service of data[1]) {
                _this._treeNode.addService(node, service);
              }
              for (let childNode of data[2]) {
                _this._treeNode.addChildNode(node, childNode);
              }

              return node;
            });
        });
    }
  }

  angular.module('editorApp')
    .service('TreeNodeProvider', TreeNodeProvider);

})();
