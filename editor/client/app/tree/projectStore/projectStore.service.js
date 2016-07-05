'use strict';

(function() {
  class ProjectStore {
    constructor(_, io, $interpolate, $resource, $location, $rootScope) {
      this.treePath = $location.search().path;
      this.isLoaded = false;
      this.version = 1;

      this._ = _;
      this._io = io;
      this._$interpolate = $interpolate;
      this._$rootScope = $rootScope;

      this._projectResource = $resource('api/project?path=:treePath', {
        treePath: '@treePath'
      });
    }

    load() {
      return this._current();
    }

    getNodeTypeDesc(name) {
      this._checkLoaded();
      let desc = this.nodeTypeDescs[name];
      if (!desc) {
        return {
          isInvalid: true,
          name: name,
          isComposite: true,
          icon: 'exclamation-triangle'
        };
      }
      return desc;
    }

    getServiceTypeDesc(name) {
      this._checkLoaded();
      let desc = this.serviceTypeDescs[name];
      if (!desc) {
        return this._getFallbackSubItemDesc(name);
      }
      return desc;
    }

    getDecoratorTypeDesc(name) {
      this._checkLoaded();
      let desc = this.decoratorTypeDescs[name];
      if (!desc) {
        return this._getFallbackSubItemDesc(name);
      }
      return desc;
    }

    getNodeDescs() {
      this._checkLoaded();
      return this.nodeTypeDescs;
    }

    /**
     * get sub item descriptors of a given type
     * @param  {string} subItemType - 'service' or 'decorator'
     * @return {desc}             descriptor
     */
    getSubItemDescs(subItemType) {
      this._checkLoaded();

      if (subItemType !== 'service' && subItemType !== 'decorator') {
        throw new Error(`invalid sub item type ${subItemType}`);
      }

      return this[subItemType + 'TypeDescs'];
    }

    getServiceDescs() {
      this._checkLoaded();
      return this.serviceTypeDescs;
    }

    getDecoratorDescs() {
      this._checkLoaded();
      return this.decoratorTypeDescs;
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

        this._startPrjChangeWatch();
      });

      return this._currentPromise;
    }

    _startPrjChangeWatch() {
      let _this = this;
      this.socket = this._io('/prj-watch', {
        query: `treePath=${this.treePath}`
      });
      this.socket.on('prj-reload', prjDataStr => {
        _this._compileProject(JSON.parse(prjDataStr));
        _this._$rootScope.$apply(() => {
          _this.updateVersion();
        });
      });
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

    _getFallbackSubItemDesc(name) {
      return {
        isInvalid: true,
        name: name,
        icon: 'exclamation-triangle'
      };
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
    .service('ProjectStore', ProjectStore);
})();
