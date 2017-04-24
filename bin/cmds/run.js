const serverRunner = require('../serverRunner');

function handler(argv) {
    serverRunner.openHome();
}

module.exports = {
    command: ['*'],
    describe: 'run owlbt',
    handler: handler
}
