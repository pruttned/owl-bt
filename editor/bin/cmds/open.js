const opn = require('opn');

function handler(argv) {
//     opn('http://www.google.com')
    console.log(` path ${argv.path}`);
}

module.exports = {
    command: ['open <path>', 'o', '*'],
    describe: 'open a tree file',
    handler: handler
}
