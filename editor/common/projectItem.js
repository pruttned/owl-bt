'use strict';

/**
 * Directory or file with supported extension (tree etc.).
 */
exports.ProjectItem = class  {
  /**
   * ctor
   * @param  {String} name - short file name without extension
   * @param  {String} fullPath - absolute path
   * @param  {ProjectItemType} type - type of this project item
   */
  constructor(name, fullPath, type) {
    this.name = name;
    this.fullPath = fullPath;
    this.type = type;
  }
};

exports.ProjectItemType = {
  DIRECTORY: 0,
  TREE: 1
};
