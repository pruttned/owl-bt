'use strict';

(function () {

  class TreeStore {
    constructor($q, $resource, TreeNodeProvider, ProjectStore, TreeNodeDtoConverter, $rootScope, Tree, TreeNode, MissingNodeItemDescValidation, TreeNodeItem) {
      // this.treePath = $location.search().path;
      this.version = 1;

      this.isLoaded = false;
      this.rootNode = null;
      this._treeResource = $resource('api/tree?path=:treePath', {
        treePath: '@treePath'
      });
      this._$q = $q;
      this._TreeNodeProvider = TreeNodeProvider;
      this._ProjectStore = ProjectStore;
      this._TreeNodeDtoConverter = TreeNodeDtoConverter;
      this._Tree = Tree;
      this._TreeNode = TreeNode;
      this._$rootScope = $rootScope;
      this._MissingNodeItemDescValidation = MissingNodeItemDescValidation;
      this._TreeNodeItem = TreeNodeItem;

      $rootScope.$watch(() => ProjectStore.version, () => this._handlePrjReload());
    }

    load(treePath) {
      let _this = this;

      this.treePath = treePath;
      this.isLoaded = false;
      this.rootNode = null;

      let treeResourcePromise = this._treeResource.get({
        treePath: this.treePath
      }).$promise;
      let prjPromise = this._ProjectStore.load(this.treePath);

      this._loadPromise = this._$q.all([treeResourcePromise, prjPromise])
        .then(data => {
          let treeData = data[0];
          _this.rootNode = _this._TreeNodeProvider.create(treeData);
          this.isLoaded = true;

          _this._MissingNodeItemDescValidation.check(_this.rootNode);
        });

      return this._loadPromise;
    }

    ensureLoad() {
      return this._loadPromise;
    }

    save() {
      if (!this.isLoaded) {
        throw new Error('Unable to save before load');
      }

      let dto = this._TreeNodeDtoConverter.convert(this.rootNode);
      let resource = new this._treeResource(dto);
      return resource.$save({
        treePath: this.treePath
      });
    }

    allItemPropertiesAreValid() {
      if (!this.isLoaded) {
        throw new Error('Tree is not loaded');
      }

      let isValid = true;
      this._Tree.forEachNode(this.rootNode, node => {
        if (!this._TreeNode.propertiesAreValid(node)) {
          isValid = false;
        }
      });
      return isValid;
    }

    updateVersion() {
      if (this.version === Number.MAX_SAFE_INTEGER) {
        this.version = 1;
      } else {
        this.version++;
      }
    }

    _handlePrjReload() {
      let _this = this;
      if (this.isLoaded) {
        this._Tree.forEachNode(this.rootNode, node => {
          node.$meta.desc = _this._ProjectStore.getNodeTypeDesc(node.type);
          _this._TreeNode.updateVersion(node);
          _this._TreeNodeItem.resetPropertiesIsValid(node);

          if (node.decorators) {
            for (let dec of node.decorators) {
              dec.$meta.desc = _this._ProjectStore.getDecoratorTypeDesc(dec.type);
              _this._TreeNodeItem.resetPropertiesIsValid(dec);
            }
          }
          if (node.services) {
            for (let svc of node.services) {
              svc.$meta.desc = _this._ProjectStore.getServiceTypeDesc(svc.type);
              _this._TreeNodeItem.resetPropertiesIsValid(svc);
            }
          }
        });
        this.updateVersion();
        this._MissingNodeItemDescValidation.check(this.rootNode);
      }
    }
  }

  angular.module('editorApp')
    .service('TreeStore', TreeStore);
})();
