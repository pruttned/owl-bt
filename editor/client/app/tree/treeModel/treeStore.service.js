'use strict';



(function() {

  class TreeStore {
    constructor($q, $resource, $location, TreeNodeProvider, ProjectStore) {
      this.treePath = $location.search().path;
      this.version = 1;

      this.isLoaded = false;
      this.rootNode = null;
      this._treeResource = $resource('api/tree?path=:treePath', {
        treePath: '@treePath'
      });
      this._$q = $q;
      this._treeNodeProvider = TreeNodeProvider;
      this._projectStore = ProjectStore;
    }

    load() {
      if (this._loadPromise) {
        return this._loadPromise;
      }

      let _this = this;

      let treeResourcePromise = this._treeResource.get({
        treePath: this.treePath
      }).$promise;
      let prjPromise = this._projectStore.load();

      this._loadPromise = this._$q.all([treeResourcePromise, prjPromise])
        .then(data => {
          let treeData = data[0];
          _this.rootNode = _this._treeNodeProvider.create(treeData);
          this.isLoaded = true;
        });

      return this._loadPromise;
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
