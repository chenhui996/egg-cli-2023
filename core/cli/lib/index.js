'use strict';

module.exports = core;

const pkg = require('../package.json');
const log = require('@egg-cli-2023/log')

function core() {
    console.log('exec core');
    checkPkgVersion();
}

function checkPkgVersion() {
    log.notice('cli', pkg.version);
}
