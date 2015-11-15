/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

let fs = require('fs');
let path = require('path');
let ProjectItemType = require('../../../common/projectItemType').ProjectItemType;

/**
 * Directory or file with supported extension (tree etc.).
 */
class ProjectItem {
  /**
   * ctor
   * @param  {String} name - short file name without extension
   * @param  {String} path - full absolute path
   * @param  {ProjectItemType} type - type of this project item (directory, tree etc.)
   */
  constructor(name, path, type) {
    this.name = name;
    this.path = path;
    this.type = type;
  }
}

/**
 * File project item types by their file extensions.
 * File extensions must begin with '.' and they must be lower case!
 * @type {Object}
 */
const fileProjectItemTypesByExtension = {
  '.owltree': ProjectItemType.TREE
};

/**
 * GET: /api/projectTree/?dirPath
 *
 * Lists files and directories directly under a specified directory.
 * Only files with extensions of owl project items are returned.
 * Symbolic links are ignored.
 * @param  {Object} req - request
 * @param  {Object} res - response; see 'return' tags
 * @return {JSON} result
 * @return {ProjectItem[]} result.projectItems - files and directories under the specified directory
 * @return {String[]} result.warnings - warnings (e.g. info about ignored items)
 */
exports.index = function(req, res) {
  let directoryPath = req.query.dirPath;
  if(directoryPath) {
    try {
      fs.accessSync(directoryPath); //whether the path exists
    } catch (ex) {
      res.sendStatus(404);
      return;
    }

    let subItemNames;
    try {
      subItemNames = fs.readdirSync(directoryPath);
    } catch (ex) {
      res.status(500).send(`Failed to get sub items of directory "${directoryPath}". Exception:\n${ex}`);
      return;
    }

    let resContent = {
      projectItems: [],
      warnings: []
    };

    subItemNames.forEach(name => {
      let fullPath = path.join(directoryPath, name);
      let stat;
      try {
        stat = fs.lstatSync(fullPath);
      } catch (ex) {
        resContent.warnings.push(`Failed to get stats of sub item "${name}" and it is therefore ignored. Exception:\n${ex}`);
        return;
      }

      if(!stat.isSymbolicLink()) { //symbolic links are ignored
        if (stat.isDirectory()) {
          resContent.projectItems.push(new ProjectItem(name, fullPath, ProjectItemType.DIRECTORY));
        } else if (stat.isFile()) {
          let type = getFileProjectItemType(name);
          if(type) { //has an supported extension; files with other extensions are ignored
            resContent.projectItems.push(new ProjectItem(name, fullPath, type));
          }
        }
      }
    });
    res.json(resContent);
  } else {
    res.status(400).send('"dirPath" must be provided in the query string.');
  }
};

function getFileProjectItemType(name) {
  let extension = path.extname(name);
  if(extension) {
    return fileProjectItemTypesByExtension[extension.toLowerCase()];
  }
  return null;
}
