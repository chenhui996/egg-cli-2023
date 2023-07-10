'use strict';

module.exports = exec;
const Package = require('@egg-cli-2023/package');

function exec() {
    console.log('exec');
    console.log(process.env.CLI_TARGET_PATH);
    console.log(process.env.CLI_HOME_PATH);
    const pkg = new Package();
    console.log(pkg);
}
