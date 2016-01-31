'use strict';

angular.module('editorApp')
  .service('EditablePropertyProvider',
    /**
     * Provides property wrappers to enable their editing. Editable property takes
     * care for notification of a parent node in cae of modifications and also track, whether its value
     * has been changed against default value specified in type descriptor
     */
    class EditablePropertyProvider {
      constructor() {
        this.EditableProperty = class EditableProperty {
          /**
           * @param  {desc} desc - property descriptor
           * @param  {String} desc.name  - property name
           * @param  {String} desc.default  - (optional) property default value
           * @param  {Object} nodeItem - node item that owns the property
           * @param  {Object} nodeItem.properties (optional-creted/removed if needed)- object (dictionary) that holds the properties (it doesn't need to have the specified property - it's presents marks whether is the property set)
           */
          constructor(desc, nodeItem) {
              this.desc = desc;
              this.name = desc.name;
              let value = nodeItem.properties ? nodeItem.properties[desc.name] : undefined;
              this.isSet = !_.isUndefined(value);
              this.nodeItem = nodeItem;
              this._value = value;
              this.defaultValue = desc.default;
            }
            //TODO: handle min/max/...
          value(value) {
            if (arguments.length) {
              this._value = value;
              this.isSet = true;

              if (!this.nodeItem.properties) {
                this.nodeItem.properties = {};
              }
              this.nodeItem.properties[this.name] = value;

              this.nodeItem.getNode().notifyChange();
            } else {
              return this.isSet ? this._value : this.defaultValue;
            }
          }
          reset() {
            this._value = undefined;
            this.isSet = false;
            if (this.nodeItem.properties) {
              delete(this.nodeItem.properties[this.name]);
              if (_.isEmpty(this.nodeItem.properties)) {
                delete(this.nodeItem.properties);
              }
            }
            this.nodeItem.getNode().notifyChange();
          }
        };

      }

      /**
       * Returns list of EditableProperty wrappers for all properties of a specified node item
       * @param  {Node|Decorator|Service} nodeItem - nullable
       * @return {EditableProperty array} - editable properties or null if nodeItem is null or it contains no properties
       */
      getEditableProperties(nodeItem) {
        if (nodeItem) {
          let typeDescProperties = nodeItem.getType().properties;
          if (typeDescProperties) {
            return typeDescProperties.map(property => new this.EditableProperty(property, nodeItem));
          }
        }
        return null;
      }
    });
