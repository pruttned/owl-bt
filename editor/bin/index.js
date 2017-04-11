#!/usr/bin/env node
'use strict';

const yargs = require('yargs');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const argv = yargs
    .commandDir('cmds')
    .help('h').alias('h', 'help')
    .demandCommand()
    .strict(true)
    .argv;