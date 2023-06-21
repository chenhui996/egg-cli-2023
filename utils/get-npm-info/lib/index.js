'use strict';

const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');

function getNpmInfo(npmName, registry) {
    // console.log(npmName);
    if (!npmName) {
        return null;
    }

    const registryUrl = registry || getDefaultRegistry(); // origin npm or taobao npm
    const npmInfoUrl = urlJoin(registryUrl, npmName);
    // console.log(npmInfoUrl);
    return axios.get(npmInfoUrl).then(response => {
        if (response.status === 200) {
            return response.data;
        }
        return null;
    }).catch(err => {
        return Promise.reject(err);
    });
}

function getDefaultRegistry(isOriginal = false) {
    return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org';
}

async function getNpmVersions(npmName, registry) {
    const data = await getNpmInfo(npmName, registry);
    if (data) {
        return Object.keys(data.versions);
    } else {
        return [];
    }
}

// 获取大于当前版本号的版本号（满足条件的版本号）
function getSemverVersions(baseVersion, versions) {
    return versions
        .filter(version => semver.satisfies(version, `>${baseVersion}`))
        .sort((a, b) => semver.compare(b, a));
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
    const versions = await getNpmVersions(npmName, registry);
    const newVersions = getSemverVersions(baseVersion, versions);
    return newVersions && newVersions.length ? newVersions[0] : null;
}

module.exports = {
    getNpmInfo,
    getNpmVersions,
    getNpmSemverVersion
};

