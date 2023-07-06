'use strict';

module.exports = core;

const path = require('path');
const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const commander = require('commander')
const log = require('@egg-cli-2023/log');
const init = require('@egg-cli-2023/init');

const constant = require('./const')
const pkg = require('../package.json');

const program = new commander.Command();

async function core() {
    // console.log('exec core');
    try {
        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
        checkUserHome();
        // checkInputArgs();
        log.verbose('debug', 'test debug log');
        checkEnv();
        await checkGlobalUpdate();
        registerCommand(); // cli entry
    } catch (error) {
        log.error(error.message);
    }
}

// 命令注册 cli entry
function registerCommand() {
    // 1
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d, --debug', '是否开启调试模式', false);

    // 命令注册
    program
        .command('init [projectName]')
        .option('-f, --force', '是否强制初始化项目')
        .action(init);

    // 实现/监听 debug 模式
    program.on('option:debug', function () {
        if (program.debug) {
            process.env.LOG_LEVEL = 'verbose';
        } else {
            process.env.LOG_LEVEL = 'info';
        }
        log.level = process.env.LOG_LEVEL;
        log.verbose('test');
    })

    // 实现/监听 未知命令
    program.on('command:*', function (obj) {
        const availableCommands = program.commands.map(cmd => cmd.name());
        console.log(colors.red('未知的命令：' + obj[0]));
        if (availableCommands.length > 0) {
            console.log(colors.red('可用命令：' + availableCommands.join(',')));
        }
    })

    program.parse(process.argv);

    if (program.args && program.args.length < 1) {
        // process.argv[0] === node
        // process.argv[1] === egg-cli-2023
        program.outputHelp();
        console.log();
    }
}

// 检查是否需要全局更新
async function checkGlobalUpdate() {
    // 1. 获取当前版本号 和 模块名
    const currentVersion = pkg.version;
    const npmName = pkg.name;
    // 2. 调用 npm API，获取所有版本号
    // 3. 提取所有版本号，比对哪些版本号是大于当前版本号
    const { getNpmSemverVersion } = require('@egg-cli-2023/get-npm-info');
    // 4. 获取最新的版本号，提示用户更新到该版本
    const lastVersion = await getNpmSemverVersion(currentVersion, npmName);
    if (lastVersion && semver.gt(lastVersion, currentVersion)) {
        log.warn('更新提示', colors.yellow(`请手动更新 ${npmName}，当前版本：${currentVersion}，最新版本：${lastVersion}，更新命令： npm install -g ${npmName}`));
    }
}

// 检查环境变量
function checkEnv() {
    const dotenv = require('dotenv');
    const dotenvPath = path.resolve(userHome, '.env');
    if (pathExists(dotenvPath)) {
        dotenv.config({
            path: dotenvPath
        });
    }
    createDefaultConfig();
    log.verbose('环境变量', process.env.CLI_HOME_PATH);
}

function createDefaultConfig() {
    const cliConfig = {
        home: userHome
    };

    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
    } else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
    }

    process.env.CLI_HOME_PATH = cliConfig.cliHome;
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
    // console.log(process.geteuid());
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
