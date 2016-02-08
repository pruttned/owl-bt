'use strict';

angular.module('editorApp')
  .service('PropertyAccessorProvider',
    /**
     * Provides property wrappers to enable their editing. Property accessor takes
     * care for notification of a parent node in cae of modifications; also track, whether its value
     * has been changed against default value specified in type descriptor; handles undo/redo functionality
     */
    class PropertyAccessorProvider {
      constructor(UndoRedoManager) {
        this.PropertyAccessor = class PropertyAccessor {
          /**
           * @param  {desc} desc - property descriptor
           * @param  {String} desc.name  - property name
           * @param  {String} desc.default  - (optional) property default value
           * @param  {Object} nodeItem - node item that owns the property
           * @param  {Object} nodeItem.properties (optional-creted/removed if needed)- object (dictionary) that holds the properties (it doesn't need to have the specified property - it's presents marks whether is the property set)
           */
          constructor(desc, nodeItem) {
            this.desc = desc;
            this.nodeItem = nodeItem;
          }
          name() {
              return this.desc.name;
            }
          isSet() {
              return this.nodeItem.properties && this.desc.name in this.nodeItem.properties;
            }
            //TODO: handle min/max/...
          value(value, skipUndoHistory) {
            if (arguments.length) {

              if (!skipUndoHistory) {
                let _this = this;
                let oldValue = angular.copy(this.value());
                let newValue = angular.copy(value);
                let oldIsSet = this.isSet();
                UndoRedoManager.add({
                  undo: function() {
                    if (oldIsSet) {
                      _this.value(oldValue, true);
                    } else {
                      _this.reset(true);
                    }
                  },
                  redo: function() {
                    _this.value(newValue, true);
                  }
                });
              }

              if (!this.nodeItem.properties) {
                this.nodeItem.properties = {};
              }
              this.nodeItem.properties[this.desc.name] = value;
              this.nodeItem.getNode().notifyChange();

            } else {
              return this.isSet() ? this.nodeItem.properties[this.desc.name] : this.desc.default;
            }
          }
          reset(skipUndoHistory) {
            if (this.isSet()) {
              if (!skipUndoHistory) {
                let _this = this;
                let oldValue = angular.copy(this.value());
                UndoRedoManager.add({
                  undo: function() {
                    _this.value(oldValue, true);
                  },
                  redo: function() {
                    _this.reset(true);
                  }
                });
              }

              if (this.nodeItem.properties) {
                delete(this.nodeItem.properties[this.desc.name]);
                if (_.isEmpty(this.nodeItem.properties)) {
                  delete(this.nodeItem.properties);
                }
              }
              this.nodeItem.getNode().notifyChange();
            }
          }
        };
      }

      /**
       * Returns list of PropertyAccessor wrappers for all properties of a specified node item
       * @param  {Node|Decorator|Service} nodeItem - nullable
       * @return {PropertyAccessor attay} - array of property accessors
       */
      getPropertyAccessors(nodeItem) {
        if (nodeItem) {
          let typeDescProperties = nodeItem.getTypeDesc().properties;
          if (typeDescProperties) {
            return typeDescProperties.map(property => new this.PropertyAccessor(property, nodeItem));
          }
        }
        return [];
      }
    });
