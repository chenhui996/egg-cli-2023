'use strict';

module.exports = exec;
const Package = require('@egg-cli-2023/package');
const log = require('@egg-cli-2023/log');

const SETTINGS = {
    init: '@egg-cli-2023/init'
};

function exec() {
    console.log('exec');
    const targetPath = process.env.CLI_TARGET_PATH;
    const homePath = process.env.CLI_HOME_PATH;
    log.verbose('targetPath', targetPath);
    log.verbose('homePath', homePath);

    const cmdObj = arguments[arguments.length - 1];
    console.log(cmdObj);
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName];
    const packageVersion = 'latest';

    const pkg = new Package({
        targetPath,
        storePath: homePath,
        packageName,
        packageVersion
    });
    console.log(pkg);
}
