'use strict';

(function() {

  class TreeNodeProvider {
    constructor($q, ProjectStore, IdProvider, TreeItemPropertyDtoConverter,
        TreeDecoratorItemProvider, TreeServiceItemProvider, TreeNode, TreeNodeByIdStore) {
        this._$q = $q;
        this._ProjectStore = ProjectStore;
        this._IdProvider = IdProvider;
        this._TreeItemPropertyDtoConverter = TreeItemPropertyDtoConverter;
        this._TreeDecoratorItemProvider = TreeDecoratorItemProvider;
        this._TreeServiceItemProvider = TreeServiceItemProvider;
        this._TreeNode = TreeNode;
        this._TreeNodeByIdStore = TreeNodeByIdStore;
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
      let desc = this._ProjectStore.getNodeTypeDesc(dto.type);
      let node = {};
      angular.extend(node, dto);
      node.type = node.type || 'unknown';
      node.$meta = {
        id: this._IdProvider.newId(),
        version: 1,
        desc: desc
      };
      delete node.services;
      delete node.decorators;
      delete node.childNodes;

      node.properties = this._TreeItemPropertyDtoConverter.convertFromDto(node.properties);

      if (dto.decorators) {
        for (let decoratorDto of dto.decorators) {
          _this._TreeNode.addDecorator(node, _this._TreeDecoratorItemProvider.create(decoratorDto));
        }
      }
      if (dto.services) {
        for (let serviceDto of dto.services) {
          _this._TreeNode.addService(node, _this._TreeServiceItemProvider.create(serviceDto));
        }
      }
      if (dto.childNodes) {
        for (let childNodeDto of dto.childNodes) {
          _this._TreeNode.addChildNode(node, _this.create(childNodeDto));
        }
      }

      this._TreeNodeByIdStore.addNode(node);
      return node;
    }
  }

  angular.module('editorApp')
    .service('TreeNodeProvider', TreeNodeProvider);

})();
