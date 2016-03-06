'use strict';

const should = require('should');
const rewire = require('rewire');
const path = require('path');
const request = require('supertest');
const mockFs = require('mock-fs');
const bluebird = require('bluebird');

delete require.cache[require.resolve('../../app')];
delete require.cache[require.resolve('../../routes')];
delete require.cache[require.resolve('./index')];

//handle mock-fs conflict with raw-body - https://github.com/tschaub/mock-fs/issues/47
var ctrl = rewire('./tree.controller');
require('./tree.controller');
require.cache[require.resolve('./tree.controller')].exports = ctrl;
var app = require('../../app');

var rootPath = path.resolve('.') //to get os specific absolute apth
var treeContent = '{"type": "sequence","name": "rootNode","decorators": [{"type": "hasAmmo"}]}';
var newTreeContent = '{"type": "sequence","name": "newName","decorators": [{"type": "hasAmmo"}]}';

describe('GET /api/tree', function() {

  beforeEach(function() {
    ctrl.__set__('fs',
      bluebird.promisifyAll(mockFs.fs({
        a: {
          b: {
            c: {
              'tree.json': treeContent
            }
          }
        }
      })));
  });


  it('should return 400 for missing tree path', function(done) {
    request(app)
      .get('/api/tree')
      .expect(400, 'Missing path', done);
  });
  it('should return 400 for non absolute path', function(done) {
    var treePath = 'a/b/c/tree.json';
    request(app)
      .get('/api/tree?path=' + encodeURIComponent(treePath))
      .expect(400, 'Path must be absolute', done);
  });
  it('should return 404 if no tree is found', function(done) {
    var treePath = path.join(rootPath, 'a/b/c/notree.json');
    request(app)
      .get('/api/tree?path=' + encodeURIComponent(treePath))
      .expect(404, 'Path not found', done);
  });
  it('should return tree', function(done) {
    var treePath = path.join(rootPath, 'a/b/c/tree.json');
    request(app)
      .get('/api/tree?path=' + encodeURIComponent(treePath))
      .expect(200, treeContent, done);
  });
});

describe('PUT /api/tree', function() {

  beforeEach(function() {
    ctrl.__set__('fs',
      bluebird.promisifyAll(mockFs.fs({
        a: {
          b: {
            c: {
              'tree.json': treeContent
            }
          }
        }
      })));
  });


  it('should return 400 for missing tree path', function(done) {
    request(app)
      .put('/api/tree')
      .send(JSON.parse(newTreeContent))
      .expect(400, 'Missing path', done);
  });
  it('should return 400 for non absolute path', function(done) {
    var treePath = 'a/b/c/tree.json';
    request(app)
      .put('/api/tree?path=' + encodeURIComponent(treePath))
      .send(JSON.parse(newTreeContent))
      .expect(400, 'Path must be absolute', done);
  });
  it('should return 404 if directory path doesn`t exists', function(done) {
    var treePath = path.join(rootPath, 'a/nodir/tree.json');
    request(app)
      .put('/api/tree?path=' + encodeURIComponent(treePath))
      .send(JSON.parse(newTreeContent))
      .expect(404, 'Path not found', done);
  });
  it('should create new file if it doesn`t exists', function(done) {
    var treePath = path.join(rootPath, 'a/b/c/notree.json');
    request(app)
      .put('/api/tree?path=' + encodeURIComponent(treePath))
      .send(JSON.parse(newTreeContent))
      .expect(200, function() {
        let ctrlFs = ctrl.__get__('fs');
        should.deepEqual(JSON.parse(ctrlFs.readFileSync(treePath, 'utf-8')), JSON.parse(newTreeContent));
        done();
      });
  });
  it('should modify file if it exists', function(done) {
    var treePath = path.join(rootPath, 'a/b/c/tree.json');
    request(app)
      .put('/api/tree?path=' + encodeURIComponent(treePath))
      .send(JSON.parse(newTreeContent))
      .expect(200, function() {
        let ctrlFs = ctrl.__get__('fs');
        should.deepEqual(JSON.parse(ctrlFs.readFileSync(treePath, 'utf-8')), JSON.parse(newTreeContent));
        done();
      });
  });
});
