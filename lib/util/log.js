'use strict';

/**
 * Created by hugo on 16/4/26.
 */

var chalk = require('chalk');
var _ = require('underscore');
var LEVER_SUCCESS = 'green';
var LEVER_INFO = 'magenta';
var LEVER_WARN = 'yellow';
var LEVER_ERROR = 'red';

function message(content, name, level) {
  var _content = chalk.gray('[' + new Date().toLocaleTimeString() + '] ');

  if (name) {
    _content += chalk[level]('[' + name + '] ');
  }
  _content += chalk[level](content);

  return _content;
}

module.exports = function (name) {
  return {

    moduleName: name,

    /**
     * 打印普通信息
     * @param content
     */
    info: function info(content) {

      console.log(message(content, this.moduleName, LEVER_INFO));
    },

    /**
     * 打印错误信息
     * @param content
     * @param errorCode
     * @param user
     */
    error: function error(content, errorCode, user) {
      console.log(chalk.bold(message(content + (errorCode ? ', 错误码: ' + errorCode : ''), this.moduleName, LEVER_ERROR)));
      user && console.log(chalk.bold(message('有疑问请联系 @' + user, this.moduleName, LEVER_ERROR)));
    },

    /**
     * 打印警告信息
     * @param content
     */
    warn: function warn(content) {
      console.log(message(content, this.moduleName, LEVER_WARN));
    },

    /**
     * 打印成功信息
     * @param content
     */
    success: function success(content) {
      console.log(message(content, this.moduleName, LEVER_SUCCESS));
    },

    /**
     * 调试信息,只有在 --debug 下 才输出
     */
    debug: function debug(content) {

      // TODO 这里需要改造 支持 任意 --x -x
      var _debug = _.indexOf(process.argv, '--debug');
      if (_debug !== -1) {
        console.log(message(content, this.moduleName, LEVER_WARN));
      }
    }
  };
};