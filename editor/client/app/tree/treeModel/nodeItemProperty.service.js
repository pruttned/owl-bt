'use strict';

(function() {

  class NodeItemProperty {

    constructor(_) {
      this._ = _;
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
      } else {
        return this.isSet(nodeItem, property) ? nodeItem.properties[property] : this.default(nodeItem, property);
      }
    }

    reset(nodeItem, property) {
      if (this.isSet(nodeItem, property)) {
        if (nodeItem.properties) {
          delete(nodeItem.properties[property]);
          if (this._.isEmpty(nodeItem.properties)) {
            delete(nodeItem.properties);
          }
        }
      }
    }

    desc(nodeItem, property) {
      let propDesc = nodeItem.$meta.desc;
      if (propDesc.properties) {
        return this._.find(propDesc.properties, {
          name: property
        });
      }
    }

    default (nodeItem, property) {
      let desc = this.desc(nodeItem, property);
      if (desc) {
        return desc.default;
      }
      return null;
    }

  }

  angular.module('editorApp')
    .service('NodeItemProperty', NodeItemProperty);
})();
