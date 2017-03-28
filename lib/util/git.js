'use strict';

/**
 * Created by hugo on 16/5/10.
 */

var fs = require('fs');
var path = require('path');
var gitlab = require('node-gitlab');
var spawn = require('cross-spawn');
var semver = require('semver');
var _ = require('underscore');
var Log = require('./log')('git');
var cwd = process.cwd();
var util = require('./index').default;
var request = require('request');
var inquirer = require('inquirer');
var prompt = inquirer.createPromptModule();
var config = {
  api: 'http://gitlab.alibaba-inc.com/api/v3',
  // fie_admin的token
  privateToken: 'vfyTw6ybgzQTu5XRtKWm'
};
var client = gitlab.createPromise(config);

/**
 * 搜索gitlab上面的project
 * @param option 搜索条件
 *     group 搜索该group下面的仓库
 *     name 搜索的仓库名
 *     page 搜索到第几页
 * @param callback 回调
 */
function searchProject(option, callback) {
  if (!option.page) option.page = 1;
  client.projects.search({ query: option.name, per_page: 100, page: option.page }).then(function (projects) {
    var len = projects.length;

    var project;
    for (var i = 0; i < len; i++) {
      var item = projects[i];
      if (item.namespace.name === option.group && item.name == option.name) {
        project = item;
        break;
      }
    }

    // 只递归10页,避免无限递归
    if (!project && option.page <= 10 && len) {
      option.page++;
      searchProject(option, callback);
    } else {
      callback && callback(project);
    }
  });
}

var GitUtil = {
  /**
   * 同步package.json的版本号为当前分支的版本
   */
  syncPackageVersion: function syncPackageVersion() {
    var file = path.join(cwd, 'package.json'),
        pkg,
        branch;

    if (fs.existsSync(file)) {
      pkg = require(file);
      branch = this.getCurBranch();
      branch = branch.replace('daily/', '');
      // 判断一下 是否是标准的 x.y.z格式
      if (semver.valid(branch)) {
        pkg.version = branch;
        fs.writeFileSync(file, JSON.stringify(pkg, null, 2), { encoding: 'utf8' });
        return branch;
      }
    }
  },

  /**
   * 打开当前项目URL
   */
  openProject: function openProject() {
    var file = path.join(cwd, '.git/config'),
        url;

    if (fs.existsSync(file)) {
      var gitConfig = fs.readFileSync(file, { encoding: 'utf8' });
      var match = gitConfig.match(/git@gitlab.alibaba-inc.com:(.*)\.git/);
      if (match && match[1]) {
        url = 'http://gitlab.alibaba-inc.com/' + match[1];
      }
    }
    return url;
  },

  /**
   * 获取当前分支
   * @returns {string}
   */
  getCurBranch: function getCurBranch() {
    var headerFile = path.join(cwd, '.git/HEAD');
    var gitVersion = fs.existsSync(headerFile) && fs.readFileSync(headerFile, { encoding: 'utf8' }) || '';
    var arr = gitVersion.split(/refs[\\\/]heads[\\\/]/g);
    var v = arr && arr[1] || '';
    return v.trim();
  },

  /**
   * 获取package中的desction字段
   * @returns {string|*}
   */
  getDescription: function getDescription() {
    var file = path.join(cwd, 'package.json'),
        pkg,
        description = '';

    if (fs.existsSync(file)) {
      pkg = require(file);
      description = pkg.description;
    }
    return description;
  },

  /**
   * 获取project name 和 group name
   * @returns {*}
   */
  getProjectAndGroupName: function getProjectAndGroupName(dest) {
    dest = dest || cwd;
    var file = path.join(dest, '.git/config');
    var pkgFile = path.join(dest, 'package.json');
    var pg;
    var gitConfig;
    var match;

    if (fs.existsSync(file)) {
      gitConfig = fs.readFileSync(file, { encoding: 'utf8' });
      if (!/git@gitlab.alibaba-inc.com:(.*)/.test(gitConfig)) {
        gitConfig = '';
      }
    }

    if (!gitConfig && fs.existsSync(pkgFile)) {
      gitConfig = require(pkgFile).repository;
      if (gitConfig && typeof gitConfig !== 'string') {
        gitConfig = gitConfig.url;
      }
    }

    if (gitConfig) {
      match = gitConfig.match(/git@gitlab.alibaba-inc.com:(.*)/);
      if (match && match[1]) {
        pg = match[1].split('/');
        return {
          groupName: pg[0],
          projectName: pg[1].replace('.git', '')
        };
      }
    }

    return {};
  },

  /**
   * 获取project Id
   * @returns {number}
   */
  getProject: function getProject(dest) {
    var that = this;
    var gitInfo = that.getProjectAndGroupName(dest);
    return new Promise(function (resolve, reject) {

      searchProject({
        group: gitInfo.groupName,
        name: gitInfo.projectName
      }, function (project) {

        resolve(project);
      });
    });
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function getUserInfo() {

    var results = spawn.sync('git', ['config', '--list']);
    var data = {
      author: '',
      email: ''
    };
    try {
      // 分成2个正则
      var regUser = /user\.name=([^\n]+)\n/;
      var regEmail = /user\.email=([^\n]+)\n/;
      var matchUser = results.stdout.toString().match(regUser);
      var matchEmail = results.stdout.toString().match(regEmail);
      // console.log(match,'==match')
      if (matchUser) {
        data.author = matchUser[1];
      }
      if (matchEmail) {
        data.email = matchEmail[1];
      }
    } catch (e) {}

    return data;
  },

  getUsersByGroupName: function getUsersByGroupName(name) {
    return new Promise(function (resolve, reject) {
      request({
        url: config.api + '/groups/' + name + '/members?per_page=1000&private_token=' + config.privateToken, // http://gitlab.alibaba-inc.com/api/v3/namespaces?private_token=4k3Yx3xVx3xkhUENyQtC',
        timeout: 5000,
        json: true
      }, function (error, response, body) {
        var id;
        if (body && body.length) {
          resolve(body.map(function (user) {
            return user.name;
          }));
        } else {
          reject(Error('error'));
        }
      });
    });
  },
  /**
   * 根据namepace 获取 id
   */
  getNamespaceIdByName: function getNamespaceIdByName(name) {
    // namespaces
    return new Promise(function (resolve, reject) {
      request({
        url: config.api + '/namespaces?per_page=100&private_token=' + config.privateToken, // http://gitlab.alibaba-inc.com/api/v3/namespaces?private_token=4k3Yx3xVx3xkhUENyQtC',
        timeout: 5000,
        json: true
      }, function (error, response, body) {
        var id;
        if (body && body.length) {
          body.forEach(function (item) {
            if (item.path === name) {
              id = item.id;
            }
          });

          resolve(id);
        } else {
          reject(Error('error'));
        }
      });
    });
  },

  /**
   * 根据当前项目中的git信息,在gitlab上创建项目
   */
  createProject: function createProject(dest) {
    dest = dest || cwd;
    var that = this;
    var gitInfo = that.getProjectAndGroupName(dest);
    var gitConfigDir = path.join(dest, '.git');

    return new Promise(function (resolve, reject) {
      Promise.all([that.getProject(dest), that.getNamespaceIdByName(gitInfo.groupName)]).then(function (data) {
        // 不存在仓库,才创建
        if (data && data[0]) {
          resolve(_.extend(gitInfo, { error: 'project' }));
        } else if (data && !data[1]) {
          resolve(_.extend(gitInfo, { error: 'ns' }));
        } else {
          var description = that.getDescription();

          if (!fs.existsSync(gitConfigDir)) {
            spawn.sync('git', ['init']);
            spawn.sync('git', ['config', 'remote.origin.url', 'git@gitlab.alibaba-inc.com:' + gitInfo.groupName + '/' + gitInfo.projectName + '.git']);
            spawn.sync('git', ['remote.origin.fetch', '+refs/heads/*:refs/remotes/origin/*']);
            spawn.sync('git', ['branch.master.remote', 'origin']);
            spawn.sync('git', ['branch.master.merge', 'refs/heads/master']);
          }

          client.projects.create({
            name: gitInfo.projectName,
            description: description,
            namespace_id: data[1],
            public: true
          }, function (response) {
            if (!response || response.statusCode == 200 || response.statusCode == undefined) {

              resolve(gitInfo);
            } else {
              resolve(_.extend(gitInfo, { error: 'create' }));
            }
          });
        }
      }, function (data) {
        resolve(_.extend(gitInfo, { error: 'project' }));
      });
    });
    // 查一下 看是否有这个仓库

  },

  /**
   * 获取该项目下所有 有权限的用户
   */
  listUsers: function listUsers() {
    var that = this;
    var gitInfo = that.getProjectAndGroupName();
    return new Promise(function (resolve, reject) {

      Promise.all([that.getProject(), that.getNamespaceIdByName(gitInfo.groupName)]).then(function (data) {

        client.projectMembers.list({
          id: data[0].id
        }).then(function (pUser) {
          return pUser;
        }, function () {
          return [];
        }).then(function (pUser) {
          client.groupMembers.list({
            id: data[1]
          }).then(function (gUser) {
            var users = gUser.concat(pUser);
            resolve(users);
          }, function () {
            resolve(pUser);
          });
        });
      });
    });
  },

  /**
   * 获取user信息
   */
  getUser: function getUser() {
    var that = this;
    return new Promise(function (resolve, reject) {
      var userInfo = that.getUserInfo();
      if (userInfo && userInfo.email) {
        // client
        client.users.list({
          search: userInfo.email
        }).then(function (data) {

          if (data && data.length) {
            data[0].email = userInfo.email;
            resolve(data[0]);
          } else {
            // gitlab上没有找到该用户
            reject(new Error('no'));
          }
        });
      } else {
        // 当前机器上没有安装git
        reject(new Error('git'));
      }
    });
  },

  addUserToProject: function addUserToProject() {
    var that = this;
    // console.log(123)
    return new Promise(function (resolve, reject) {
      // 获取user 和 project 信息 再添加用户到project
      Promise.all([that.getUser(), that.getProject()]).then(function (data) {
        if (data && data[0] && data[1]) {
          client.projectMembers.create({
            user_id: data[0].id,
            id: data[1].id,
            access_level: 40
          }).then(function (response) {

            if (response && response.id) {
              resolve(data);
            } else {
              reject(Error('create'));
            }
          });
        } else {
          reject(Error('create'));
        }
      });
    });
  },

  /**
   * 判断线上文件是否存在
   * @param url
   */
  checkFileExit: function checkFileExit(url) {}
};
module.exports = GitUtil;