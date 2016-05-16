'use strict';

(function() {

  class ProjectStore {
    constructor(_, $interpolate, $resource, $location) {
      this.treePath = $location.search().path;

      this._ = _;
      this._$interpolate = $interpolate;
      this._projectResource = $resource('api/project?path=:treePath', {
        treePath: '@treePath'
      });
    }

    getNodeTypeDesc(name) {
      return this._current()
        .then(prj => prj.nodeTypes[name]);
    }

    getServiceTypeDesc(name) {
      return this._current()
        .then(prj => prj.serviceTypes[name]);
    }

    getDecoratorTypeDesc(name) {
      return this._current()
        .then(prj => prj.decoratorTypes[name]);
    }

    _current() {
      if (this._currentPromise) {
        return this._currentPromise;
      }

      let _this = this;

      this._currentPromise = this._projectResource.get({
        treePath: this.treePath
      }).$promise.then(prjData => {
        if (!_this._currentVal) {
          _this._currentVal = _this._compileProject(prjData);
        }
        return _this._currentVal;
      });

      return this._currentPromise;
    }

    _compileProject(prjData) {
      function objByName(obj) {
        return obj.name;
      }

      let prj = {
        nodeTypes: this._.keyBy(prjData.nodes || [], objByName),
        serviceTypes: this._.keyBy(prjData.services || [], objByName),
        decoratorTypes: this._.keyBy(prjData.decorators || [], objByName)
      };

      this._compileDescriptions(prj.nodeTypes);
      this._compileDescriptions(prj.serviceTypes);
      this._compileDescriptions(prj.decoratorTypes);

      return prj;
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
