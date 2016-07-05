'use strict';

(function() {

  class MissingNodeItemDescValidation {
    constructor(_, AlertList, TreeStore, Tree) {
      this._ = _;
      this._AlertList = AlertList;
      this._TreeStore = TreeStore;
      this._Tree = Tree;
    }

    check() {
      if (this._TreeStore.rootNode) {
        let missingDescs = this._getMissingDescriptors();

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

    _getMissingDescriptors() {
      let missingDescs = {
        node: {},
        decorator: {},
        service: {}
      };

      this._Tree.forEachNode(this._TreeStore.rootNode, node=>{
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
      });

      return missingDescs;
    }
  }

  angular.module('editorApp')
    .service('MissingNodeItemDescValidation', MissingNodeItemDescValidation);
})();
