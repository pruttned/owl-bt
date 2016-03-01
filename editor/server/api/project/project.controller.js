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
  return fs.readFileAsync(projectAbsolutePath, 'utf8')
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
  let currentPath = req.query.path;
  if (!currentPath) {
    res.status(400).send('Missing path');
    return;
  }
  if (!path.isAbsolute(currentPath)) {
    res.status(400).send('Path must be absolute');
    return;
  }

  let pathDir = path.dirname(currentPath);
  findProjectFile(pathDir)
    .then(prjContent => {
      if (!prjContent) {
        res.status(404).send('No project found');
      }else{
        res.contentType('application/json').send(prjContent)
      }
    })
    .catch(err => {
      next(err);
    });

};
