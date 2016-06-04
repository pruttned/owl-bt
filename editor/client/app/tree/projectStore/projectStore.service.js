'use strict';

(function() {

  class ProjectStore {
    constructor(_, $interpolate, $resource, $location) {
      this.treePath = $location.search().path;
      this.isLoaded = false;

      this._ = _;
      this._$interpolate = $interpolate;
      this._projectResource = $resource('api/project?path=:treePath', {
        treePath: '@treePath'
      });
    }

    load() {
      return this._current();
    }

    getNodeTypeDesc(name) {
      this._checkLoaded();
      if (this.nodeTypeDescs) {
        return this.nodeTypeDescs[name];
      }
    }

    getServiceTypeDesc(name) {
      this._checkLoaded();
      if (this.serviceTypeDescs) {
        return this.serviceTypeDescs[name];
      }
    }

    getDecoratorTypeDesc(name) {
      this._checkLoaded();
      if (this.decoratorTypeDescs) {
        return this.decoratorTypeDescs[name];
      }
    }

    _checkLoaded() {
      if (!this.isLoaded) {
        throw new Error('Project is not loaded');
      }
    }

    _current() {
      if (this._currentPromise) {
        return this._currentPromise;
      }

      let _this = this;

      this._currentPromise = this._projectResource.get({
        treePath: this.treePath
      }).$promise.then(prjData => {
        _this._compileProject(prjData);
        this.isLoaded = true;
      });

      return this._currentPromise;
    }

    _compileProject(prjData) {
      function objByName(obj) {
        return obj.name;
      }

      this.nodeTypeDescs = this._.keyBy(prjData.nodes || [], objByName);
      this.serviceTypeDescs = this._.keyBy(prjData.services || [], objByName);
      this.decoratorTypeDescs = this._.keyBy(prjData.decorators || [], objByName);

      this._compileDescriptions(this.nodeTypeDescs);
      this._compileDescriptions(this.serviceTypeDescs);
      this._compileDescriptions(this.decoratorTypeDescs);
    }

    _compileDescriptions(typeDict) {
      for (let typeName in typeDict) {
        if (typeDict.hasOwnProperty(typeName)) {
          let type = typeDict[typeName];
          if (type.description) {
            type.description = this._$interpolate(type.description);
          }
        }
      }
    }
  }

  angular.module('editorApp')
    .service('ProjectStore', ProjectStore);
})();
