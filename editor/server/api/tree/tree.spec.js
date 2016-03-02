'use strict';

var should = require('should');
var app = require('../../app');
var path = require('path');
var request = require('supertest');
var mockFs = require('mock-fs');


var rootPath = path.resolve('.') //to get os specific absolute apth
var treeContent = '{"type": "sequence","name": "rootNode","decorators": [{"type": "hasAmmo"}}';

describe('GET /api/tree', function() {

  beforeEach(function() {
    mockFs({
      a: {
        b: {
          c: {
            'tree.json': treeContent
          }
        }
      }
    });
  });

  afterEach(function() {
    mockFs.restore();
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
