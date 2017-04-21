'use strict';

const path = require('path');
const errors = require('errno-codes');
const bluebird = require('bluebird');
let fs = bluebird.promisifyAll(require("fs"));
const _ = require('lodash');
const fileWatcher = require('../fileWatcher');
const project = require('../project');

const eventName = 'prj-reload';
const url = '/prj-watch';


let prjWatchers = {};

function getFileWatcher(prjPath) {
  let watcher = prjWatchers[prjPath];
  if (!watcher) {
    watcher = fileWatcher.create(prjPath);
    prjWatchers[prjPath] = watcher;
  }
  return watcher;
}

function start(io) {
  let prjWatchIo = io.of(url);
  prjWatchIo.on('connection', socket => {

    let prjWatcher;

    let treePath = socket.request._query.treePath;
    let pathDir = path.dirname(treePath);

    socket.on('disconnect', () => {
      if (prjWatcher) {
        prjWatcher.removeListener(socket.id);
      }
    });

    project.getProject(pathDir)
      .then(prj => {
        prjWatcher = getFileWatcher(prj.path);
        prjWatcher.addListener(socket.id, (prjContent) => {
          socket.emit(eventName, prjContent);
        });
      });
  });
}

module.exports = {
  start: start
};
