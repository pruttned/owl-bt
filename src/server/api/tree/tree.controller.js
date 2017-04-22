'use strict';

const bluebird = require('bluebird'),
  fs = bluebird.promisifyAll(require("fs")),
  path = require('path'),
  errors = require('errno-codes'),
  project = require('../../components/project');

function checkTreePath(treePath, res) {
  if (!treePath) {
    res.status(400).send('Missing path');
    return false;
  }
  if (!path.isAbsolute(treePath)) {
    res.status(400).send('Path must be absolute');
    return false;
  }
  return true;
}

function checkIsInProject(treePath, res) {
  return project.getProject(treePath)
    .then(prj => {
      if (prj) {
        return true;
      }
      res.status(403).send('Path must be in project');
    });
}

function handleError(err, res, next) {
  if (err.code !== errors.ENOENT.code) {
    next(err);
  } else {
    res.status(404).send('Path not found');
  }
}

exports.index = function (req, res, next) {
  let treePath = req.query.path;
  if (checkTreePath(treePath, res)) {
    checkIsInProject(treePath, res)
      .then(isInProject => {
        if (isInProject) {
          return fs.readFileAsync(treePath, 'utf8')
            .then(treeContent => {
              res.contentType('application/json').send(treeContent)
            });
        }
      })
      .catch(err => handleError(err, res, next));
  }
};

exports.save = function (req, res, next) {
  let treePath = req.query.path;

  if (checkTreePath(treePath, res)) {
    checkIsInProject(treePath, res)
      .then(isInProject => {
        if (isInProject) {
          return fs.writeFileAsync(treePath, JSON.stringify(req.body, null, '\t'), 'utf8')
            .then(treeContent => {
              res.status(200).send();
            });
        }
      })
      .catch(err => handleError(err, res, next));
  }
};
