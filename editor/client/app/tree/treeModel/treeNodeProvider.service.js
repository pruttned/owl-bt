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
      let desc = this._projectStore.getNodeTypeDesc(dto.type);
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

      if (dto.decorators) {
        for (let decoratorDto of dto.decorators) {
          _this._treeNode.addDecorator(node, _this._treeDecoratorItemProvider.create(decoratorDto));
        }
      }
      if (dto.services) {
        for (let serviceDto of dto.services) {
          _this._treeNode.addService(node, _this._treeServiceItemProvider.create(serviceDto));
        }
      }
      if (dto.childNodes) {
        for (let childNodeDto of dto.childNodes) {
          _this._treeNode.addChildNode(node, _this.create(childNodeDto));
        }
      }

      return node;
    }
  }

  angular.module('editorApp')
    .service('TreeNodeProvider', TreeNodeProvider);

})();
