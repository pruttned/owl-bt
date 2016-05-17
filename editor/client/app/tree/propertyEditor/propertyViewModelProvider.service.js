'use strict';

(function() {

  class PropertyViewModel {
    /**
     *  @param  {Object} node - node that contains the specified nodeItem or whose
     * @param  {desc} desc - property descriptor
     * @param  {String} desc.name  - property name
     * @param  {String} desc.default  - (optional) property default value
     * @param  {Object} nodeItem - (optional) node item that owns the property. Null or node for node property
     * @param  {Object} nodeItem.properties (optional-creted/removed if needed)- object (dictionary) that holds the properties (it doesn't need to have the specified property - it's presents marks whether is the property set)
     */
    constructor(node, nodeItem, desc, treeNodeItemProperty, commandExecutor) {
      this.node = node;
      this.desc = desc;
      this.nodeItem = nodeItem || this.node;

      this._treeNodeItemProperty = treeNodeItemProperty;
      this._commandExecutor = commandExecutor;
    }
    name() {
      return this.desc.name;
    }
    isSet() {
      return this._treeNodeItemProperty.isSet(this.nodeItem, this.name());
    }
    value(value) {
      if (arguments.length) {
        this._commandExecutor.exec('SetTreeNodeItemPropertyValueCmd', {
          node: this.node,
          nodeItem: this.nodeItem,
          property: this.name(),
          value: value
        });
      } else {
        return this._treeNodeItemProperty.value(this.nodeItem, this.name());
      }
    }
    reset() {
      this._commandExecutor.exec('ResetTreeNodeItemPropertyValueCmd', {
        node: this.node,
        nodeItem: this.nodeItem,
        property: this.name()
      });
    }
  }

  class PropertyViewModelProvider {
    constructor(TreeNodeItemProperty, CommandExecutor) {
        this._treeNodeItemProperty = TreeNodeItemProperty;
        this._commandExecutor = CommandExecutor;
      }
      /**
       * Returns view models for all properties of a specified node item
       *  @param  {Object} node - node that contains the specified nodeItem or whose. Null - returns empty array
       * @param  {Object} nodeItem - (optional) node item that owns the property. Null or node for node property
       * @return {PropertyViewModel array} - array of property accessors
       */
    create(node, nodeItem) {
      if (node) {
        let typeDescProperties = nodeItem.$meta.desc.properties;
        if (typeDescProperties) {
          return typeDescProperties.map(property => new PropertyViewModel(node, nodeItem, property, this._treeNodeItemProperty, this._commandExecutor));
        }
      }
      return [];
    }
  }

  angular.module('editorApp')
    .service('PropertyViewModelProvider', PropertyViewModelProvider);
})();
