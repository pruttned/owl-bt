/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');

module.exports = function(app) {
  var env = app.get('env');

  app.set('views', path.join(config.root, 'src/server/views'));
  app.use(bodyParser.json());

  app.use('/api/', function(req, res, next) { //media type check
    if (req.method === 'POST' || req.method === 'PUT' ) {
      let contentType = req.headers['content-type'];
      if (!contentType || contentType.indexOf('application/json') !== 0) {
        return res.send(415);
      }
    }
    next();
  });

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'dist/public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'dist/public')));
    app.set('appPath', path.join(config.root, 'dist/public'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'src/client')));
    app.use('/babel-polyfill', express.static(path.join(config.root, 'node_modules/babel-polyfill/dist')));
    app.use('/string_score', express.static(path.join(config.root, 'node_modules/string_score')));
    app.use('/common', express.static(path.join(config.root, 'src/common')));
    app.use('/bootstrap-sass', express.static(path.join(config.root, 'node_modules/bootstrap-sass')));
    app.use('/font-awesome', express.static(path.join(config.root, 'node_modules/font-awesome')));
    app.use('/jquery', express.static(path.join(config.root, 'node_modules/jquery/dist')));
    app.use('/angular', express.static(path.join(config.root, 'node_modules/angular')));
    app.use('/angular-bootstrap', express.static(path.join(config.root, 'node_modules/angular-bootstrap')));
    app.use('/angular-cookies', express.static(path.join(config.root, 'node_modules/angular-cookies')));
    app.use('/angular-resource', express.static(path.join(config.root, 'node_modules/angular-resource')));
    app.use('/angular-sanitize', express.static(path.join(config.root, 'node_modules/angular-sanitize')));
    app.use('/angular-route', express.static(path.join(config.root, 'node_modules/angular-route')));
    app.use('/angular-hotkeys', express.static(path.join(config.root, 'node_modules/angular-hotkeys')));
    app.use('/angular-ui-bootstrap', express.static(path.join(config.root, 'node_modules/angular-ui-bootstrap/dist')));
    app.use('/d3', express.static(path.join(config.root, 'node_modules/d3')));
    app.use('/undo-manager', express.static(path.join(config.root, 'node_modules/undo-manager')));
    app.use('/lodash', express.static(path.join(config.root, 'node_modules/lodash')));
    app.use('/toposort', express.static(path.join(config.root, 'node_modules/toposort-class/build')));
    app.use('/jquery-mousewheel', express.static(path.join(config.root, 'node_modules/jquery-mousewheel')));
    app.use('/malihu-custom-scrollbar-plugin', express.static(path.join(config.root, 'node_modules/malihu-custom-scrollbar-plugin')));
    app.use('/ng-scrollbars', express.static(path.join(config.root, 'node_modules/ng-scrollbars/dist')));    
    app.set('appPath', path.join(config.root, 'src/client'));
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};