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
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
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
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', path.join(config.root, 'public'));
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'src/client')));
    app.use('/babel-polyfill', express.static(path.join(config.root, 'node_modules/babel-polyfill/dist')));
    app.use('/string_score', express.static(path.join(config.root, 'node_modules/string_score')));
    app.use('/socket.io-client', express.static(path.join(config.root, 'node_modules/socket.io-client')));
    app.use('/common', express.static(path.join(config.root, 'src/common')));
    app.set('appPath', path.join(config.root, 'src/client'));
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};
