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

function getProject(treePath, res) {
  return project.getProject(treePath)
    .then(prj => {
      if (prj) {
        return prj;
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
    getProject(treePath, res)
      .then(project => {
        if (project) {
          return fs.readFileAsync(treePath, 'utf8')
            .then(treeStrContent => {
              var treeContent = JSON.parse(treeStrContent);
              return Promise.resolve(project.plugin && project.plugin.onTreeLoad && project.plugin.onTreeLoad({
                tree: treeContent,
                path: treePath,
                project: JSON.parse(project.content),
                projectPath: project.path
              }))
                .then(() => treeContent)
            })
            .then(treeContent => res.contentType('application/json').send(treeContent))
        }
      })
      .catch(err => handleError(err, res, next));
  }
};

exports.save = function (req, res, next) {
  let treePath = req.query.path;

  if (checkTreePath(treePath, res)) {
    getProject(treePath, res)
      .then(project => {
        if (project) {

          var treeContent = req.body;

          return Promise.resolve(project.plugin && project.plugin.onTreeSave && project.plugin.onTreeSave({
            tree: treeContent,
            path: treePath,
            project: JSON.parse(project.content),
            projectPath: project.path,
          }))
            .then(() => fs.writeFileAsync(treePath, JSON.stringify(treeContent, null, '\t'), 'utf8')
              .then(treeContent => {
                res.status(200).send();
              }));
        }
      })
      .catch(err => handleError(err, res, next));
  }
};
