'use strict';

(function() {

  /**
   * Converts parts of the tree model between runtime and store representation
   */
  class TreeModelConverter {

    constructor() {
      this.nextId = 1;
    }

    newId() {
      if (this.nextId === Number.MAX_SAFE_INTEGER) {
        throw new Error('max id reached');
      }
      return this.nextId++;
    }

    convertPropertiesToRuntime(propsArray) {
      let propsObj = {};
      if (propsArray) {
        for (let prop of propsArray) {
          propsObj[prop.name] = prop.value;
        }
      }
      return propsObj;
    }

    convertSubItemToRuntime(data) {
      let item = {};
      angular.extend(item, data);
      item.properties = this.convertPropertiesToRuntime(item.properties);
      return item;
    }

    convertNodeToRuntime(nodeData) {
      let node = {};
      angular.extend(node, nodeData);
      this.addNodeMetaInfo(node);
      node.properties = this.convertPropertiesToRuntime(node.properties);

      node.decorators = node.decorators ? node.decorators.map(d => this.convertSubItemToRuntime(d)) : [];
      node.services = node.services ? node.services.map(s => this.convertSubItemToRuntime(s)) : [];
      node.childNodes = node.childNodes ? node.childNodes.map(n => this.convertNodeToRuntime(n)) : [];

      return node;
    }

    addNodeMetaInfo(node) {
      node._meta = {
        id: this.newId(),
        version: 1
      };
    }

    //TODO: runtime to store conversion
  }

  angular.module('editorApp')
    .service('TreeModelConverter', TreeModelConverter);
})();
