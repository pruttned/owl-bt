'use strict';

angular.module('editorApp')
  /**
   * Stores project references in the local storage
   */
  .service('ProjectStore', function(_, JsonSerializer) {

    const projectsStoreKey = 'ProjectStore.projects';

    //init items
    let prjStorageValue = localStorage.getItem(projectsStoreKey);
    if (prjStorageValue) {
      this.projects = JsonSerializer.deserialize(prjStorageValue);
    } else {
      this.projects = [];
    }

    /**
     * Adds a new project
     * @param  {Object} project - project object
     * @param  {String} project.path - full path to project`s root directory, that contains
     *                       	the owlbt.json file
     */
    this.addProject = function(project) {
      if (!project) {
        throw new Error('project is required');
      }
      if (!project.path) {
        throw new Error('project.path is required');
      }

      if(this.projects.findIndex(p => p.path === project.path) > -1){
        throw new Error('duplicate project path');
      }
      this.projects.push(project);

      localStorage.setItem(projectsStoreKey, JsonSerializer.serialize(this.projects));
    };

    /**
     * Removes a specific project
     * @param  {Object or string} project - project object or string containing project path
     * @return {Bool} Whether was specified project found and removed
     */
    this.removeProject = function(project) {
      let prjIndex;
      if (_.isString(project)) {
        prjIndex = this.projects.findIndex(this.projects, function(prj) {
          return prj.path === project;
        });
      } else {
        prjIndex = this.projects.indexOf(project);
      }
      if (prjIndex >= 0) {
        this.projects.splice(prjIndex, 1);
      }

      localStorage.setItem(projectsStoreKey, JsonSerializer.serialize(this.projects));

      return prjIndex >= 0;
    };
  });
