'use strict';

const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require("fs"));
const path = require('path');
const errors = require('errno-codes');

exports.index = function(req, res, next) {
  let treePath = req.query.path;
  if (!treePath) {
    res.status(400).send('Missing path');
    return;
  }
  if (!path.isAbsolute(treePath)) {
    res.status(400).send('Path must be absolute');
    return;
  }

  fs.readFileAsync(treePath, 'utf8')
  .then(treeContent=> {
    res.contentType('application/json').send(treeContent)
  })
  .catch(err => {
    if (err.code !== errors.ENOENT.code) {
      throw err;
    } else {
      res.status(404).send('Path not found');
    }
  });
};
