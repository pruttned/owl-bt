'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,
};