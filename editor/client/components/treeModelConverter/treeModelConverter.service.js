'use strict';

(function() {

  /**
   * Converts parts of the tree model between runtime and store representation
   */
  class TreeModelConverter {

    constructor() {
      this.nextId = 1;
    }

    convertNodeToRuntime(nodeData) {
      let node = {};
      angular.extend(node, nodeData);
      this._addNodeMetaInfo(node);
      node.properties = this._convertPropertiesToRuntime(node.properties);

      node.decorators = node.decorators ? node.decorators.map(d => this._convertSubItemToRuntime(d)) : [];
      node.services = node.services ? node.services.map(s => this._convertSubItemToRuntime(s)) : [];
      node.childNodes = node.childNodes ? node.childNodes.map(n => this.convertNodeToRuntime(n)) : [];

      return node;
    }

    convertNodeToStore(node) {
      let data = {};
      angular.extend(data, node);

      delete data._meta;

      if (data.properties) {
        data.properties = this._convertPropertiesToStore(data.properties);
        if(_.isEmpty(data.properties)){
          delete data.properties;
        }
      }
      if (data.decorators) {
        data.decorators = data.decorators.map(d => this._convertSubItemToStore(d));
      }
      if (data.services) {
        data.services = data.services.map(s => this._convertSubItemToStore(s));
      }
      if (data.childNodes) {
        data.childNodes = data.childNodes.map(n => this.convertNodeToStore(n));
      }

      this._clearEmptyArrays(data);

      return data;
    }

    _newId() {
      if (this.nextId === Number.MAX_SAFE_INTEGER) {
        throw new Error('max id reached');
      }
      return this.nextId++;
    }

    _convertPropertiesToRuntime(propsArray) {
      let propsObj = {};
      if (propsArray) {
        for (let prop of propsArray) {
          propsObj[prop.name] = prop.value;
        }
      }
      return propsObj;
    }

    _convertSubItemToRuntime(data) {
      let item = {};
      angular.extend(item, data);
      item.properties = this._convertPropertiesToRuntime(item.properties);
      return item;
    }

    _addNodeMetaInfo(node) {
      node._meta = {
        id: this._newId(),
        version: 1
      };
    }

    _convertPropertiesToStore(propsObj) {
      let propsArray = [];
      if (propsObj) {
        for (let prop in propsObj) {
          if (propsObj.hasOwnProperty(prop)) {
            propsArray.push({
              name: prop,
              value: propsObj[prop]
            });
          }
        }
      }
      return propsArray;
    }

    _convertSubItemToStore(item) {
      let data = {};
      angular.extend(data, item);
      this._clearEmptyArrays(data);
      if (data.properties) {
        data.properties = this._convertPropertiesToStore(data.properties);
        if(_.isEmpty(data.properties)){
          delete data.properties;
        }
      }
      return data;
    }

    _clearEmptyArrays(obj) {
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          let value = obj[prop];
          if (value && _.isArray(value) && !value.length) {
            delete obj[prop];
          }
        }
      }
    }

  }

  angular.module('editorApp')
    .service('TreeModelConverter', TreeModelConverter);
})();
