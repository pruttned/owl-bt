'use strict';

angular.module('editorApp')
  /**
   * Collection of projects connected to a project store
   */
  .service('ProjectStore', function() {

    var projectsStoreKey = 'ProjectStore.projects';

    var prjStorageValue = localStorage.getItem(projectsStoreKey);
    if(prjStorageValue){
      this.projects = JSON.parse(prjStorageValue);
      console.log(this.projects);
    }else {
      this.projects = [];
    }

    /**
     * Adds a new project defined by its root directory
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

  });
