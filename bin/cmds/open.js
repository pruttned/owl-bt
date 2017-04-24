const path = require('path'),
    serverRunner = require('../serverRunner');

function handler(argv) {

    const treePath = path.resolve(argv.path);

    serverRunner.openTree(treePath);
}

module.exports = {
    command: ['open <path>', 'o'],
    describe: 'open a tree file',
    handler: handler
}
