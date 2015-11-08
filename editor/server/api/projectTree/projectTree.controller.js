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
let issue = require('../../../common/issue');
let projectItem = require('../../../common/projectItem');

/**
 * File project item types by their file extensions.
 * File extensions must begin with '.' and they must be lower case!
 * @type {Object}
 */
const fileProjectItemTypesByExtension = {
  '.owltree': projectItem.ProjectItemType.TREE
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
 * @return {Issue[]} result.issues - issues
 */
exports.index = function(req, res) {
  let resContent = {
    projectItems: [],
    issues: []
  };

  let directoryPath = req.query.dirPath;
  if(directoryPath) {
    let subItemNames;
    try {
      subItemNames = fs.readdirSync(directoryPath);
    } catch (ex) {
      resContent.issues.push(new issue.Issue(issue.IssueSeverity.ERROR, `Failed to get sub items of directory "${directoryPath}".`, ex));
    }

    if(subItemNames) {
      subItemNames.forEach(name => {
        let fullPath = path.join(directoryPath, name);
        let stat;
        try {
          stat = fs.lstatSync(fullPath);
        } catch (ex) {
          resContent.issues.push(new issue.Issue(issue.IssueSeverity.WARNING, `Failed to get stats of sub item "${name}" and it is therefore ignored.`, ex));
        }

        if(stat && !stat.isSymbolicLink()) { //symbolic links are ignored
          if (stat.isDirectory()) {
            resContent.projectItems.push(new projectItem.ProjectItem(name, fullPath, projectItem.ProjectItemType.DIRECTORY));
          } else if (stat.isFile()) {
            let type = getFileProjectItemType(name);
            if(type) { //has an supported extension
              resContent.projectItems.push(new projectItem.ProjectItem(name, fullPath, type));
            }
          }
        }
      });
    }
  } else {
    resContent.issues.push(new issue.Issue(issue.IssueSeverity.ERROR, 'dirPath query string must be specified.'));
  }

  res.json(resContent);
};

function getFileProjectItemType(name) {
  let extension = path.extname(name);
  if(extension) {
    return fileProjectItemTypesByExtension[extension.toLowerCase()];
  }
  return null;
}
