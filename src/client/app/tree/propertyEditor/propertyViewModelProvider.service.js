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
    constructor(node, nodeItem, desc, TreeNodeItemProperty, SetTreeNodeItemPropertyValueAction, ResetTreeNodeItemPropertyValueAction) {
      this.node = node;
      this.desc = desc;
      this.nodeItem = nodeItem || this.node;

      this._TreeNodeItemProperty = TreeNodeItemProperty;
      this._SetTreeNodeItemPropertyValueAction = SetTreeNodeItemPropertyValueAction;
      this._ResetTreeNodeItemPropertyValueAction = ResetTreeNodeItemPropertyValueAction;
    }
    name() {
      return this.desc.name;
    }
    isSet() {
      return this._TreeNodeItemProperty.isSet(this.nodeItem, this.name());
    }
    value(value) {
      if (arguments.length) {
        this._SetTreeNodeItemPropertyValueAction.exec({
          node: this.node,
          nodeItem: this.nodeItem,
          property: this.name(),
          value: value
        });
      } else {
        return this._TreeNodeItemProperty.value(this.nodeItem, this.name());
      }
    }
    reset() {
      this._ResetTreeNodeItemPropertyValueAction.exec({
        node: this.node,
        nodeItem: this.nodeItem,
        property: this.name()
      });
    }
  }

  class PropertyViewModelProvider {
    constructor(TreeNodeItemProperty, SetTreeNodeItemPropertyValueAction, ResetTreeNodeItemPropertyValueAction) {
        this._TreeNodeItemProperty = TreeNodeItemProperty;
        this._SetTreeNodeItemPropertyValueAction = SetTreeNodeItemPropertyValueAction;
        this._ResetTreeNodeItemPropertyValueAction = ResetTreeNodeItemPropertyValueAction;
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
          return typeDescProperties.map(property => new PropertyViewModel(node, nodeItem, property, 
            this._TreeNodeItemProperty, this._SetTreeNodeItemPropertyValueAction, this._ResetTreeNodeItemPropertyValueAction));
        }
      }
      return [];
    }
  }

  angular.module('editorApp')
    .service('PropertyViewModelProvider', PropertyViewModelProvider);
})();
