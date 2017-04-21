const path = require('path'),
    opn = require('opn'),
    server = require('../../src/server'),
    serverConfig = require('../../src/server/config/environment');

function handler(argv) {

    const treePath = path.resolve(argv.path);

    server.run({
        success: () => {
            opn(`${serverConfig.baseUrl}:${serverConfig.port}/tree?path=${encodeURIComponent(treePath)}`)
        }
    });
}

module.exports = {
    command: ['open <path>', 'o', '*'],
    describe: 'open a tree file',
    handler: handler
}
