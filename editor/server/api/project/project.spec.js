'use strict';

var should = require('should');
var app = require('../../app');
var path = require('path');
var request = require('supertest');
var mockFs = require('mock-fs');


var rootPath = path.resolve('.') //to get os specific absolute apth
var projectContent = '{"nodes":[{"name":"sequence"}]}';

describe('GET /api/project', function() {

  beforeEach(function() {
    mockFs({
      a: {
        'owl-bt.json': projectContent,
        'tree.json': 'aaa',
        b: {
          c: {
            'tree.json': 'aaa'
          }
        }
      },
      noPrjDir: {
        'tree.json': 'aaa',
        b: {
          c: {
            'tree.json': 'aaa'
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
      .get('/api/project')
      .expect(400, 'Missing path', done);
  });
  it('should return 400 for non absolute path', function(done) {
    var treePath = 'a/b/c/tree.json';
    request(app)
      .get('/api/project?path=' + encodeURIComponent(treePath))
      .expect(400, 'Path must be absolute', done);
  });
  it('should return 404 if no project is found in root path', function(done) {
    var treePath = path.join(rootPath, 'noPrjDir/b/c/tree.json');
    request(app)
      .get('/api/project?path=' + encodeURIComponent(treePath))
      .expect(404, 'No project found', done);
  });
  it('should find project in tree directory', function(done) {
    var treePath = path.join(rootPath, 'a/tree.json');
    request(app)
      .get('/api/project?path=' + encodeURIComponent(treePath))
      .expect(200, projectContent, done);
  });
  it('should find project in root path', function(done) {
    var treePath = path.join(rootPath, 'a/b/c/tree.json');
    request(app)
      .get('/api/project?path=' + encodeURIComponent(treePath))
      .expect(200, projectContent, done);
  });
});
