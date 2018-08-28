'use strict';

const path = require('path');
const errors = require('errno-codes');
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require("fs"));
const reload = require('require-reload')(require);

const projectFileName = 'owl-bt.json';
const pluginFileName = 'owl-bt.js';


function getParentPath(absolutePath) {
  let parentPath = path.resolve(absolutePath, '..');
  if (parentPath === absolutePath) {
    return null;
  }
  return parentPath;
}

function getProjectForDir(currentAbsolutePath) {
  let projectAbsolutePath = path.join(currentAbsolutePath, projectFileName);
  return fs.readFileAsync(projectAbsolutePath, 'utf8')
    .then(prjContent => {
      const prjPluginPath = path.join(path.dirname(projectAbsolutePath), pluginFileName);
      let plugin;
      if (fs.existsSync(prjPluginPath)) {
        plugin = reload(prjPluginPath);
      }
      return {
        path: projectAbsolutePath,
        content: prjContent,
        plugin: plugin
      }
    })
    .catch(err => {
      if (err.code !== errors.ENOENT.code) {
        throw err;
      } else {
        var parentPath = getParentPath(currentAbsolutePath);
        if (parentPath) {
          return getProjectForDir(parentPath);
        }
      }
    });
}

function getProject(treePath) {
  return getProjectForDir(path.dirname(treePath));
}

module.exports = {
  getProject: getProject
};
