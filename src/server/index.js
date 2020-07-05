/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('express'),
  config = require('./config/environment'),
  projectWatcher = require('./components/projectWatcher'),
  http = require('http'),
  socektIo = require('socket.io');

/**
 * @param  {Function()} (optional) success - callback after succesfull server run
 * @return {express} - expressa pp
 * */
function run({ success } = {}) {
  var app = express();
  var server = http.createServer(app);
  var io = socektIo(server);

  require('./express')(app);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (success) {
        success();
      }
    } else {
      throw err;
    }
  });

  server.listen(config.port, () => {
    projectWatcher.start(io);
    if (success) {
      success();
    }
  });

  return app;
}

module.exports = {
  run: run
}