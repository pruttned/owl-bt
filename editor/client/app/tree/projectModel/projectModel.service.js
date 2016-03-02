'use strict';

(function() {

  /**
   * Project model for the current tree.
   * It contains all node/sub node types
   */
  class ProjectModel {
      constructor( $interpolate, data) {

        function objByName(obj){
          return obj.name;
        }

        this.nodeTypes = _.keyBy(data.nodes || [], objByName);
        this.serviceTypes =  _.keyBy(data.services || [], objByName);
        this.decoratorTypes =  _.keyBy(data.decorators || [], objByName);

      this.compileDescriptions($interpolate, this.nodeTypes);
      this.compileDescriptions($interpolate, this.serviceTypes);
      this.compileDescriptions($interpolate, this.decoratorTypes);
    }

    getNodeTypeDesc(name) {
      let nodeType = this.nodeTypes[name];
      if (!nodeType) {
        throw new Error(`Unknown nodeType "${name}"`);
      }
      return nodeType;
    }

    getServiceTypeDesc(name) {
      let serviceType = this.serviceTypes[name];
      if (!serviceType) {
        throw new Error(`Unknown serviceType "${name}"`);
      }
      return serviceType;
    }

    getDecoratorTypeDesc(name) {
      let decoratorType = this.decoratorTypes[name];
      if (!decoratorType) {
        throw new Error(`Unknown decoratorType "${name}"`);
      }
      return decoratorType;
    }

    compileDescriptions($interpolate, typeDict) {
      for (let typeName in typeDict) {
        if (typeDict.hasOwnProperty(typeName)) {
          let type = typeDict[typeName];
          if (type.description) {
            type.description = $interpolate(type.description);
          }
        }
      }
    }
  }

  class ProjectModelProvider {
    constructor($interpolate, $resource, $location) {
      this.$interpolate = $interpolate;
      this.treePath = $location.search().path;
      this.projectResource = $resource('api/project?path=:treePath', {
        treePath: '@treePath'
      }, {
        query: {
          method: 'GET'
        }
      });
    }

    get() {
      if (this.getPromise) {
        return this.getPromise;
      }

      let provider = this;

      this.getPromise = this.projectResource.get({
        treePath: this.treePath
      }).$promise.then(modelData => {
        if (!provider.model) {
          provider.model = new ProjectModel(this.$interpolate, modelData);
        }
        return provider.model;
      });

      return this.getPromise;
    }
  }

  angular.module('editorApp')
    .service('ProjectModel', ProjectModelProvider);
})();
