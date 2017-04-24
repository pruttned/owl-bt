'use strict';

const opn = require('opn'),
    server = require('../src/server'),
    serverConfig = require('../src/server/config/environment');

function openTree(treePath) {
    server.run({
        success: () => {
            opn(`${serverConfig.baseUrl}:${serverConfig.port}/tree?path=${encodeURIComponent(treePath)}`)
        }
    });
}
function openHome() {
    server.run({
        success: () => {
            opn(`${serverConfig.baseUrl}:${serverConfig.port}`)
        }
    });
}

module.exports = {
    openTree: openTree,
    openHome: openHome
};
