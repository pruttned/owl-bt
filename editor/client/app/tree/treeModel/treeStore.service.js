'use strict';



(function() {

  class TreeStore {
    constructor($resource, $location, TreeNodeProvider) {
      this.treePath = $location.search().path;
      this.version = 1;

      this._treeResource = $resource('api/tree?path=:treePath', {
        treePath: '@treePath'
      });
      this._treeNodeProvider = TreeNodeProvider;
    }

    rootNode() {
      if (this.rootNodePromise) {
        return this.rootNodePromise;
      }

      let _this = this;

      this._rootNodePromise = this._treeResource.get({
          treePath: this.treePath
        }).$promise
        .then(treeData => {
          if (!_this._rootNode) {
            _this._rootNode = _this._treeNodeProvider.create(treeData);
          }
          return _this._rootNode;
        });

      return this._rootNodePromise;
    }

    updateVersion() {
      if (this.version === Number.MAX_SAFE_INTEGER) {
        this.version = 1;
      } else {
        this.version++;
      }
    }

  }

  angular.module('editorApp')
    .service('TreeStore', TreeStore);
})();
