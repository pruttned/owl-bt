'use strict';

const should = require('should');
const rewire = require('rewire');
const path = require('path');
const _ = require('lodash');

var fileWatcher = rewire('./index');

describe('fileWatcher', function() {

  let fsMock;
  beforeEach(function() {
    fsMock = {
      fsWatchers: [],
      readFileAsync: function() {
        return new Promise(function(fulfill, reject) {
          fulfill('file content');
        });
      },
      watch: function(file, callback) {
        let fs = this;
        this.watchCallCnt++;
        let fsWatcher = {
          close: function() {
            fs.fsWatchers = _.without(fs.fsWatchers, this);
          },
          notify: function() {
            callback();
          }
        }
        this.fsWatchers.push(fsWatcher);
        return fsWatcher;
      }
    };
    fileWatcher.__set__('fs', fsMock);
  });

  it('adding multiple listeners should create only one real fs watcher', function() {
    let watcher = fileWatcher.create('path');
    watcher.addListener('1', () => {});
    watcher.addListener('2', () => {});
    should(fsMock.fsWatchers.length).be.exactly(1);
  });

  it('removing all listeners should close real fs watcher', function() {
    let watcher = fileWatcher.create('path');
    watcher.addListener('1', () => {});
    watcher.addListener('2', () => {});
    watcher.removeListener('1');
    should(fsMock.fsWatchers.length).be.exactly(1);
    watcher.removeListener('2');
    should(fsMock.fsWatchers.length).be.exactly(0);
  });

  it('adding listener after close should reopen real fs watcher', function() {
    let watcher = fileWatcher.create('path');
    watcher.addListener('1', () => {});
    watcher.addListener('2', () => {});
    watcher.removeListener('1');
    watcher.removeListener('2');
    watcher.addListener('1', () => {});
    should(fsMock.fsWatchers.length).be.exactly(1);
  });

  it('changing watched file should call listeners with file content', function(done) {
    let watcher = fileWatcher.create('path');
    let listenerCallLog = [];
    watcher.addListener('1', (content) => {
      listenerCallLog.push(content);
    });
    watcher.addListener('2', (content) => {
      listenerCallLog.push(content);
      should(listenerCallLog.length).be.exactly(2);
      should(listenerCallLog[0]).be.exactly('file content');
      should(listenerCallLog[1]).be.exactly('file content');
      done();
    });

    fsMock.fsWatchers[0].notify();
  });

});
