'use strict';

const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require("fs"));
const path = require('path');
const errors = require('errno-codes');

//TODO: extract
const projectFileName = 'owl-bt.json';

function getParentPath(absolutePath) {
  let parentPath = path.resolve(absolutePath, '..');
  if (parentPath === absolutePath) {
    return null;
  }
  return parentPath;
}

function findProjectFile(currentAbsolutePath) {
  let projectAbsolutePath = path.join(currentAbsolutePath, projectFileName);
  return fs.readFileAsync(projectAbsolutePath)
    .then(data => JSON.parse(data))
    .catch(err => {
      if (err.code !== errors.ENOENT.code) {
        throw err;
      } else {
        var parentPath = getParentPath(currentAbsolutePath);
        if (parentPath) {
          return findProjectFile(parentPath);
        }
      }
    });
}

exports.index = function(req, res, next) {
  let treePath = req.params[0];
  //TODO: path must be absolute
  //TODO: 404
  if (treePath) {
    let treePathDir = path.dirname(treePath);
    findProjectFile(treePathDir)
      .then(prjContent => res.json(prjContent))
      .catch(err => {
        next(err);
      });
  }else{
    res.status(400).send('Missing tree path');
  }
};
