const path = require('path'),
    opn = require('opn'),
    server = require('../../src/server'),
    serverConfig = require('../../src/server/config/environment');

function handler(argv) {
    server.run({
        success: () => {
            opn(`${serverConfig.baseUrl}:${serverConfig.port}`)
        }
    });
}

module.exports = {
    command: ['*'],
    describe: 'run owlbt',
    handler: handler
}
