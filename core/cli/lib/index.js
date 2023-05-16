'use strict';

module.exports = core;

const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const log = require('@egg-cli-2023/log');

const constant = require('./const')
const pkg = require('../package.json');

function core() {
    console.log('exec core');
    try {
        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
        checkUserHome();
        checkInputArgs();
        log.verbose('debug', 'test debug log');
    } catch (error) {
        log.error(error.message);
    }
}


// 检查用户入参
function checkInputArgs() {
    const minimist = require('minimist');
    const args = minimist(process.argv.slice(2));
    checkArgs(args);
}

function checkArgs(params) {
    if (params.debug) {
        process.env.LOG_LEVEL = 'verbose';
    } else {
        process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
}

// 检查用户主目录
function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在！'));
    }
}

// 检查 root 账户 
function checkRoot() {
    const rootCheck = require('root-check');
    rootCheck();
    console.log(process.geteuid());
}

// node 最低版本号检查
function checkNodeVersion() {
    const currentVersion = process.version;
    const lowestVersion = constant.LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`egg-cli-2023 需要安装 v${lowestVersion} 以上版本的 Node.js`));
    }
}

// 包版本号检查
function checkPkgVersion() {
    log.notice('cli', pkg.version);
}
