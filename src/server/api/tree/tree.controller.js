'use strict';

const bluebird = require('bluebird');
var fs = bluebird.promisifyAll(require("fs"));
const path = require('path');
const errors = require('errno-codes');

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

function handleFsError(err, res, next) {
  if (err.code !== errors.ENOENT.code) {
    next(err);
  } else {
    res.status(404).send('Path not found');
  }
}

exports.index = function(req, res, next) {
  let treePath = req.query.path;
  if (checkTreePath(treePath, res)) {

    fs.readFileAsync(treePath, 'utf8')
      .then(treeContent => {
        res.contentType('application/json').send(treeContent)
      })
      .catch(err => handleFsError(err, res, next));
  }
};

exports.save = function(req, res, next) {
  let treePath = req.query.path;
  if (checkTreePath(treePath, res)) {
    fs.writeFileAsync(treePath, JSON.stringify(req.body, null, '\t'), 'utf8')
      .then(treeContent => {
        res.status(200).send();
      })
      .catch(err => handleFsError(err, res, next));
  }
};
