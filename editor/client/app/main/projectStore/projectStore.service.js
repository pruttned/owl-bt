'use strict';

angular.module('editorApp')
  /**
   * Collection of projects connected to a project store
   */
  .service('ProjectStore', function() {

    var projectsStoreKey = 'ProjectStore.projects';

    //init items
    var prjStorageValue = localStorage.getItem(projectsStoreKey);
    if (prjStorageValue) {
      this.projects = JSON.parse(prjStorageValue);
    } else {
      this.projects = [];
    }

    /**
     * Adds a new project
     * @param  {Object} project - project object
     * @param  {string} project.path - full path to project`s root directory, that contains
     *                       	the owlbt.json file
     */
    this.addProject = function(project) {
      if (!project) {
        throw new Error('project is required');
      }
      if (!project.path) {
        throw new Error('project.path is required');
      }

      //TODO: check name
      this.projects.push(project);

      //TODO: replace with service that ignores fields injected by angular
      localStorage.setItem(projectsStoreKey, JSON.stringify(this.projects));
    };

    /**
     * Removes a specific project
     * @param  {Object or string} project - project object or string containing project path
     * @return {bool} Whether was specified project found and removed
     */
    this.removeProject = function(project) {
      if (!project) {
        throw new Error('project is required');
      }

      var prjIndex;
      if (_.isString(project)) {
        prjIndex = _.findIndex(this.projects, function(prj) {
          return prj.path === project;
        });
      } else {
        prjIndex = this.projects.indexOf(project);
      }
      if (prjIndex >= 0) {
        this.projects.splice(prjIndex, 1);
      }

      //TODO: replace with service that ignores fields injected by angular
      localStorage.setItem(projectsStoreKey, JSON.stringify(this.projects));
    };
  });
