/**
 * 包管理工具集合
 * @author 擎空 <zhenwu.czw@alibaba-inc.com>
 */

'use strict';

var request = require('request');
var registry = 'http://registry.npm.alibaba-inc.com/';
var cwd = process.cwd();
var spawn = require('cross-spawn');
var npmCommand = 'tnpm';
var noop = function noop() {};
var mkdirp = require('mkdirp');
var fs = require('fs');
var util = require('util');
var path = require('path');
var syncRequest = require('sync-request');

var TnpmModule = {

  /**
   * @param options
   * @param options.name  包名
   * @param options.cwd  安装路径,默认为执行当前命令的目录
   * @param options.save   是否保存,没有name时,此参数无效
   * @param options.stdio  输出, 默认 inherit
   * @param options.version  输出, 默认 latest
   * @param options.global  全局 , 默认 false
   * @param cb
   */
  install: function install(options, cb) {

    // 判断有几个参数,如果第一个参数是一个function,则这个function是callback,且忽略后面的cb
    if (typeof options == 'function') {
      cb = options;
      options = {};
    }

    var spawnArgs = [];
    var cli;

    if (options.name) {

      options.version = options.version || 'latest';

      // 没有name的话就相应于直接安装依赖
      spawnArgs.push(options.name + '@' + options.version);

      if (options.global) {
        spawnArgs.push('-g');
      }

      // 有name时,判断是否需要save
      if (options.save) {
        spawnArgs.push('--save');
      }
    }
    spawnArgs.push('--registry=' + registry);

    spawnArgs.push('-c');

    // return console.log(options.name + '@' + options.version);

    cli = spawn(path.resolve(__dirname, '../node_modules/.bin/npminstall'), spawnArgs, {
      // cli = spawn(npmCommand, spawnArgs, {
      cwd: options.cwd || cwd,
      env: process.env,
      stdio: options.stdio || 'inherit'
    });

    cli.on('close', function (status) {

      if (status == 0) {
        cb(null);
      } else if (status === 243) {
        // 尝试自动修复权限
        cb('权限错误');
      } else {
        cb(status);
      }
    });
  },

  /**
   *
   * @param options
   * @param options.name  包名
   * @param options.cwd  安装路径,默认为执行当前命令的目录
   * @param options.save   是否保存,没有name时,此参数无效
   * @param options.stdio  输出, 默认 inherit
   * @param cb
   */
  uninstall: function uninstall(options, cb) {

    var spawnArgs = ['uninstall'];
    var cli;

    options = options || {};
    cb = cb || noop;

    if (options.name) {
      // 没有name的话就相应于直接安装依赖
      spawnArgs.push(options.name);
      // 有name时,判断是否需要save
      if (options.save) {
        spawnArgs.push('--save');
      }
    }

    cli = spawn(npmCommand, spawnArgs, {
      cwd: options.cwd || cwd,
      env: process.env,
      stdio: options.stdio || 'inherit'
    });

    cli.on('close', function (status) {

      if (status == 0) {
        cb(null);
      } else if (status === 243) {
        cb('权限错误');
      } else {
        console.error(status);
        cb(status);
      }
    });
  },

  /**
   * 安装传入或当前目录的package.json,安装tnpm依赖
   * @param options
   * @param options.cwd  package.json文件路径,默认为执行当前命令的目录
   * @param options.stdio  输出
   * @param cb
   */
  installDependencies: function installDependencies(options, cb) {
    this.install(options, cb);
  },

  /**
   * 到 tnpm 服务器去获取最新版本npm包信息
   * @param packageName
   * @param cb
   */
  lastVersion: function lastVersion(packageName, cb) {

    request({
      url: registry + encodeURIComponent(packageName) + '/latest?' + Math.random(),
      timeout: 5000,
      json: true
    }, function (error, response, body) {
      var version;
      var packageJson;

      if (error) {
        cb(error);
        return;
      }

      if (response.statusCode === 200) {

        if (body.error) {
          cb(new Error(body.error));
          return;
        }

        version = body.version;
        packageJson = body;

        cb(null, version, packageJson);
      } else if (response.statusCode === 404) {
        cb(new Error('404'));
      } else {
        cb(new Error('tnpm error with code ' + response.statusCode + ']'));
      }
    });
  },

  /**
   * 判断tnpm模块是否存在(同步方法)
   * @param packageName
   * @returns {{exist: boolean, version: string}}
   */
  moduleExistSync: function moduleExistSync(packageName) {

    var mpkg;
    var result = {
      exist: false,
      version: '',
      name: packageName
    };
    var res = syncRequest('GET', registry + encodeURIComponent(packageName) + '/latest?' + Math.random(), {
      timeout: 5000
    });

    if (res.statusCode === 200) {
      mpkg = JSON.parse(res.getBody().toString());
      result.exist = true;
      result.version = mpkg.version;
    }

    return result;
  }

};

module.exports = TnpmModule;