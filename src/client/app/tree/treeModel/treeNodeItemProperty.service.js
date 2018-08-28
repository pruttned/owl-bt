'use strict';

(function () {

  const BASE_TYPES = {
    string: 1,
    number: 1,
    bool: 1,
    enum: 1,
  };

  class TreeNodeItemProperty {

    constructor(_, PropertyValidator, ProjectStore) {
      this._ = _;
      this._PropertyValidator = PropertyValidator;
      this._ProjectStore = ProjectStore;
    }

    isSet(nodeItem, property) {
      return nodeItem.properties && (property in nodeItem.properties);
    }

    /**
     * get/set value
     */
    value(nodeItem, property, value) {
      //TODO: handle min/max/...
      if (arguments.length > 2) {
        if (!nodeItem.properties) {
          nodeItem.properties = {};
        }
        nodeItem.properties[property] = value;
        this._updateIsValid(nodeItem, property);
      } else {
        return this.isSet(nodeItem, property) ? nodeItem.properties[property] : this.default(nodeItem, property);
      }
    }

    reset(nodeItem, property) {
      if (this.isSet(nodeItem, property)) {
        if (nodeItem.properties) {
          delete (nodeItem.properties[property]);
          if (this._.isEmpty(nodeItem.properties)) {
            delete (nodeItem.properties);
          }
        }
      }
    }

    desc(nodeItem, property) {
      let desc = nodeItem.$meta.desc;
      if (desc.properties) {
        return this._.find(desc.properties, {
          name: property
        });
      }
    }

    default(nodeItem, property) {
      let desc = this.desc(nodeItem, property);
      if (desc) {
        return desc.default;
      }
      return null;
    }

    isValid(nodeItem, property) {
      if (!nodeItem.$meta.propertyStates || !nodeItem.$meta.propertyStates[property] || nodeItem.$meta.propertyStates[property].isValid === undefined) {
        this._updateIsValid(nodeItem, property);
      }
      return nodeItem.$meta.propertyStates[property].isValid;
    }

    resetIsValid(nodeItem, property) {
      if (nodeItem.$meta.propertyStates && nodeItem.$meta.propertyStates[property]) {
        delete nodeItem.$meta.propertyStates[property].isValid;
      }
    }

    _updateIsValid(nodeItem, property) {
      if (!nodeItem.$meta.propertyStates) {
        nodeItem.$meta.propertyStates = {};
      }
      let propertyState = nodeItem.$meta.propertyStates && nodeItem.$meta.propertyStates[property];
      if (!propertyState) {
        propertyState = {};
        nodeItem.$meta.propertyStates[property] = propertyState;
      }
      let value = this.value(nodeItem, property);

      let propertyDesc = this.desc(nodeItem, property);
      let customTypeDesc = this._isCustomType(propertyDesc) && this._ProjectStore.getCustomType(propertyDesc.type);
      propertyState.isValid = this._PropertyValidator.isValid(value, propertyDesc, customTypeDesc);
    }

    _isCustomType(propertyDesc) {
      return !BASE_TYPES[propertyDesc.type];
    }
  }

  angular.module('editorApp')
    .service('TreeNodeItemProperty', TreeNodeItemProperty);
})();
