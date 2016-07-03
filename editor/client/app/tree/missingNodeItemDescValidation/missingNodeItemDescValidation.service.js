'use strict';

(function() {

  class MissingNodeItemDescValidation {
    constructor(_, AlertList, TreeStore) {
      this._ = _;
      this._AlertList = AlertList;
      this._TreeStore = TreeStore;
    }

    check() {
      if (this._TreeStore.rootNode) {
        let missingDescs = this._getMissingDescriptors(this._TreeStore.rootNode);

        let missingNodeDescs = this._.keys(missingDescs.node);
        if (missingNodeDescs.length > 0) {
          this._AlertList.addErr('Missing node descriptors: ' + missingNodeDescs.join(', '));
        }

        let missingDecoratorDescs = this._.keys(missingDescs.decorator);
        if (missingDecoratorDescs.length > 0) {
          this._AlertList.addErr('Missing decorator descriptors: ' + missingDecoratorDescs.join(', '));
        }

        let missingServiceDescs = this._.keys(missingDescs.service);
        if (missingServiceDescs.length > 0) {
          this._AlertList.addErr('Missing service descriptors: ' + missingServiceDescs.join(', '));
        }
      }
    }

    _getMissingDescriptors(node, missingDescs) {
      missingDescs = missingDescs || {
        node: {},
        decorator: {},
        service: {}
      };

      if (node.$meta.desc.isInvalid) {
        missingDescs.node[node.$meta.desc.name] = true;
      }

      if (node.decorators) {
        for (let dec of node.decorators) {
          if (dec.$meta.desc.isInvalid) {
            missingDescs.decorator[dec.$meta.desc.name] = true;
          }
        }
      }
      if (node.services) {
        for (let svc of node.services) {
          if (svc.$meta.desc.isInvalid) {
            missingDescs.service[svc.$meta.desc.name] = true;
          }
        }
      }

      if (node.childNodes) {
        for (let i = 0; i < node.childNodes.length; i++) {
          this._getMissingDescriptors(node.childNodes[i], missingDescs);
        }
      }
      return missingDescs;
    }
  }

  angular.module('editorApp')
    .service('MissingNodeItemDescValidation', MissingNodeItemDescValidation);
})();
