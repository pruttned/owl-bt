'use strict';

const rc = require('rc');

const rcCfg = rc('owlbt', {
  port : 8955
});

// Production specific configuration
// =================================
module.exports = {
  // Server port
  port:    process.env.PORT ||
            rcCfg.port,
};