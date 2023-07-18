'use strict';

const {isObject} = require('@egg-cli-2023/utils');

class Package {
    constructor(options) {
        console.log('init package');
        if(!options){
            throw new Error('Package类的options参数不能为空！');
        }
        if(!isObject(options)){
            throw new Error('Package类的options参数必须为对象！');
        }
        // package 路径
        this.targetPath = options.targetPath;
        // package 存储路径
        this.storePath = options.storePath;
        // package 名称
        this.packageName = options.packageName;
        // package 版本
        this.packageVersion = options.packageVersion;
    }

    // 判断当前 Package 是否存在
    exists() {

    }

    // 安装 Package
    install() {

    }

    // 更新 Package
    update() {

    }

    // 获取入口文件的路径
    getRootFilePath() {

    }
}

module.exports = Package;
