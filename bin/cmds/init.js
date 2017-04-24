'use strict';

const path = require('path'),
    bluebird = require('bluebird'),
    fs = bluebird.promisifyAll(require("fs"));


function handler(argv) {
    const projDirPath = path.resolve(argv.path);
    fs.readFileAsync(path.join(__dirname, '../templates/owl-bt.json'), 'utf8')
        .then(template => fs.writeFileAsync(path.join(projDirPath, 'owl-bt.json'), template, {
            flag: 'wx'
        }));
}

module.exports = {
    command: ['init [path]', 'i'],
    describe: 'init new owl-bt project in a given directory',
    handler: handler
}
