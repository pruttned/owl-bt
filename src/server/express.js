/**
 * Express configuration
 */

'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const path = require('path');

module.exports = function (app) {
  var env = app.get('env');

  app.use(bodyParser.json());


  app.use('/api/', function (req, res, next) { //media type check
    if (req.method === 'POST' || req.method === 'PUT') {
      let contentType = req.headers['content-type'];
      if (!contentType || contentType.indexOf('application/json') !== 0) {
        return res.send(415);
      }
    }
    next();
  });

  require('./apiRoutes')(app);

  app.use(express.static(path.join(__dirname, '../../public')));
  if ('production' === env) {
    const distDir = path.join(__dirname, '../../dist');
    app.use(express.static(distDir));
    app.route('/*')
      .get(function (_, res) {
        res.sendFile(path.join(distDir, 'index.html'));
      });

  } else {
    const config = require('../../webpack.config.js')(null, {
      mode: env
    });
    const compiler = require('webpack')(config);
    const webpackDevMiddleware = require('webpack-dev-middleware')(compiler);
    const webpackHotMiddleware = require('webpack-hot-middleware')(compiler);
    app.use(webpackDevMiddleware);
    app.use(webpackHotMiddleware);
    app.use('*', function (_, res, next) {
      var filename = path.join(compiler.outputPath, 'index.html');
      webpackDevMiddleware.waitUntilValid(() => {
        compiler.outputFileSystem.readFile(filename, function (err, result) {
          if (err) {
            return next(err);
          }
          res.set('content-type', 'text/html');
          res.send(result);
          res.end();
        });
      });
    });

    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};