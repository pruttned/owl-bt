'use strict';

const path = require('path');
const errors = require('errno-codes');
const bluebird = require('bluebird');
let fs = bluebird.promisifyAll(require("fs"));
const _ = require('lodash');

const fsWatchDebounceTimeout = 500;

/**
 * Module for watching single file for changes by multiple listeners.
 * Renames are not supported - if the file is removed/renamed or inaccessible by other means, then all listeners are called with undefined content
 */
class FileWatcher {
  constructor(prjPath) {
    this.prjPath = prjPath;
    this.listeners = {};
    this._fsWatcher = null;
  }

  /**
   * add change listener
   * @param {String}   id  - listener id
   * @param {Function} callback - fun(fileContent)
   */
  addListener(id, callback) {
    if (!this._fsWatcher) {
      this._startFsWatcher();
    }
    if (this.listeners.hasOwnProperty((id))) {
      throw new Error(`duplicate listener id "${id}"`);
    }
    this.listeners[id] = callback;
  }

  removeListener(id) {
    delete this.listeners[id];
    if (_.isEmpty(this.listeners)) {
      this._stopFsWatcher();
    }
  }

  _startFsWatcher() {
    let _this = this;
    this._fsWatcher = fs.watch(this.prjPath, _.debounce(() => {
      fs.readFileAsync(_this.prjPath, 'utf8')
        .then(prjContent => {
          _this._notify(prjContent);
        })
        .catch((e)=>{
          console.warn(e);
          _this._notify();
        });
    }, fsWatchDebounceTimeout))
  }

  _stopFsWatcher() {
    if (this._fsWatcher) {
      this._fsWatcher.close();
      this._fsWatcher = null;
    }
  }

  _notify(prjContent) {
    for (var listenerId in this.listeners) {
      if (this.listeners.hasOwnProperty(listenerId)) {
        this.listeners[listenerId](prjContent);
      }
    }
  }
}

function create(prjPath) {
  return new FileWatcher(prjPath);
}

module.exports = {
  create: create
};
