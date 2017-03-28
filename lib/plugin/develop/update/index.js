'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../../../util');

var _util2 = _interopRequireDefault(_util);

var _exec = require('../../../util/exec');

var _exec2 = _interopRequireDefault(_exec);

var _commander = require('../config/commander');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inquirer = require('inquirer');
var prompt = inquirer.createPromptModule();
var path = require('path');
var co = require('co');

var Log = require('../../../util/log')('Rock');
var Copy = require('../../../util/template-copy');
var GitUtil = require('../../../util/git');

var cwd = process.cwd();
var chalk = require('chalk');
var fs = require('fs');


function upper(name) {
  var index = name.indexOf('\/');
  if (index > -1) {
    name = name.substring(0, index);
  }
  var arr = name.split('-');
  return arr.map(function (word) {
    return word.toLowerCase().replace(/^\S/g, function (s) {
      return s.toUpperCase();
    });
  }).join('');
}

function getConfig() {
  return prompt([{
    type: 'list',
    message: '确定更新Rock么,更新会覆盖你部分文件?',
    choices: [{
      name: '不更新',
      value: 0
    }, {
      name: '更新',
      value: 1
    }],
    default: 0,
    name: 'confirm'
  }]);
}
function filenameTransformer(name) {
  if (name === '__gitignore') {
    name = '.gitignore';
  } else if (name === '__package') {
    name = 'package.json';
  } else if (name === '__eslintrc') {
    name = '.eslintrc.js';
  } else if (name === '__npmignore') {
    name = '.npmignore';
  } else if (name === '__eslintignore') {
    name = '.eslintignore';
  } else if (name === '__gulpfile') {
    name = 'gulpfile.js';
  }
  return name;
}
var ignoreFiles = ['node_modules', 'packages', 'build', 'README.md', '.DS_Store', '.idea'];

exports.default = function () {
  co(regeneratorRuntime.mark(function _callee() {
    var config, pkgJSON, curVersion, maxVersion;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getConfig();

          case 2:
            config = _context.sent;

            if (!config.confirm) process.exit(0);
            pkgJSON = _util2.default.readFileJson(cwd + '/package.json');

            config.projectName = pkgJSON.name;
            config.author = pkgJSON.author;
            curVersion = _util2.default.getCurVersion(), maxVersion = void 0;

            Log.info('正在获取@ali/rock的最新版本...');
            _context.prev = 9;
            _context.next = 12;
            return _util2.default.getMaxVersion('@ali/rock');

          case 12:
            maxVersion = _context.sent;
            _context.next = 19;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context['catch'](9);

            Log.error('获取@ali/rock最新版本失败');
            process.exit(1);

          case 19:
            if (!(maxVersion === curVersion)) {
              _context.next = 23;
              break;
            }

            Log.info('你已经是@ali/rock的最新版本【' + maxVersion + '】');
            _context.next = 34;
            break;

          case 23:
            Log.info('正在更新Rock脚手架版本...');
            _context.prev = 24;
            _context.next = 27;
            return (0, _exec2.default)('sudo', ['tnpm', 'update', '@ali/rock', '-g'], { stdio: 'inherit' });

          case 27:
            _context.next = 33;
            break;

          case 29:
            _context.prev = 29;
            _context.t1 = _context['catch'](24);

            Log.error('更新Rock脚手架版本失败');
            process.exit(1);

          case 33:
            Log.info('更新Rock脚手架版本完成');

          case 34:
            Copy.dir({
              src: path.resolve(__dirname, '../template/project'),
              dist: cwd,
              data: {
                projectName: config.projectName,
                author: config.author,
                version: _commander.version
              },
              ignore: ignoreFiles,
              filenameTransformer: filenameTransformer
            });
            Log.info('正在通过tnpm安装依赖包...');
            _context.prev = 36;
            _context.next = 39;
            return (0, _exec2.default)('tnpm', ['install'], {
              stdio: 'inherit',
              cwd: cwd
            });

          case 39:
            _context.next = 46;
            break;

          case 41:
            _context.prev = 41;
            _context.t2 = _context['catch'](36);

            _context.t2 && Log.error(_context.t2);
            Log.error('tnpm 依赖安装失败，请自行排查或联系【洛丹】');
            process.exit(1);

          case 46:
            Log.success('rock更新完毕...');

          case 47:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[9, 15], [24, 29], [36, 41]]);
  }));
};