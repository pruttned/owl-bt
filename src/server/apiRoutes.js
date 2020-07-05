'use strict';

module.exports = (app) => {
  app.use('/api/project', require('./api/project'));
  app.use('/api/tree', require('./api/tree'));
};
