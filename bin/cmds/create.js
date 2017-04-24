const path = require('path'),
    bluebird = require('bluebird'),
    fs = bluebird.promisifyAll(require("fs")),
    project = require('../../src/server/components/project'),
    serverRunner = require('../serverRunner');

function handler(argv) {

    const treePath = path.resolve(argv.path);

    project.getProject(treePath)
        .then(prj => {
            if (!prj) {
                throw new Error('path is not in owlbt project');
            }
        })
        .then(() => fs.readFileAsync(path.join(__dirname, '../templates/tree.json'), 'utf8'))
        .then(template => fs.writeFileAsync(treePath, template, {
            flag: 'wx'
        }))
        .then(() => serverRunner.openTree(treePath));
}

module.exports = {
    command: ['create <path>', 'c'],
    describe: 'create a tree file and opens it',
    handler: handler
}
