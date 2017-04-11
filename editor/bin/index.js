'use strict';

const yargs = require('yargs');

const argv = yargs
    .commandDir('cmds')
    .help('h').alias('h', 'help')
    .demandCommand()
    .strict(true)
    .argv;