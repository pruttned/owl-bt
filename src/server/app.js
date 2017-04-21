'use strict';

const server = require('.'),
  config = require('./config/environment');

const app = server.run({
  success: () => {
    console.log(`owl-bt server is running on port ${config.port} in ${process.env.NODE_ENV} mode`);
  }
});
module.exports = app;