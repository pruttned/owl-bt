'use strict';



(function() {

  class TreeStore {
    constructor($q, $resource, $location, ProjectStore, TreeNodeProvider) {
      this.treePath = $location.search().path;
      this.version = 1;

      this._$q = $q;
      this._treeResource = $resource('api/tree?path=:treePath', {
        treePath: '@treePath'
      });
      this._treeNodeProvider = TreeNodeProvider;
      this._projectStore = ProjectStore;
    }

    rootNode() {
      if (this.rootNodePromise) {
        return this.rootNodePromise;
      }

      let _this = this;

      var projectModelPromise = this._projectStore.current();
      var treePromise = this._treeResource.get({
        treePath: this.treePath
      }).$promise;

      this._rootNodePromise = this._$q.all([projectModelPromise, treePromise])
        .then(data => {
          if (!_this._current) {
            let projectModel = data[0];
            let treeData = data[1];
            _this._rootNode = this._treeNodeProvider.create(treeData, projectModel);
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
