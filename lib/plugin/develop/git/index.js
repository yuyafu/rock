'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _exec = require('../../../util/exec');

var _exec2 = _interopRequireDefault(_exec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GitUtil = require('../../../util/git');
var Log = require('../../../util/log')('git');
var chalk = require('chalk');

var inquirer = require('inquirer');
var prompt = inquirer.createPromptModule();
var co = require('co');
var handler = {
  user: function user() {
    // let data = GitUtil.getUserInfo();
    co(regeneratorRuntime.mark(function _callee() {
      var data;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return GitUtil.getUsersByGroupName('rock');

            case 2:
              data = _context.sent;

              Log.info(JSON.stringify(data, null, '\t'));

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));
  },
  commit: function commit(type, commander) {
    co(regeneratorRuntime.mark(function _callee2() {
      var commentOpt;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              commentOpt = commander.comment ? ['commit', '-m', commander.comment] : ['commit'];
              _context2.prev = 1;
              _context2.next = 4;
              return (0, _exec2.default)('git', ['add', '-A', '.'], { stdio: 'inherit' });

            case 4:
              _context2.next = 6;
              return (0, _exec2.default)('git', commentOpt, { stdio: 'inherit' });

            case 6:
              _context2.next = 8;
              return (0, _exec2.default)('git', ['fetch'], { stdio: 'inherit' });

            case 8:
              _context2.next = 10;
              return (0, _exec2.default)('git', ['rebase', 'origin/master'], { stdio: 'inherit' });

            case 10:
              _context2.next = 12;
              return (0, _exec2.default)('git', ['add', '-A', '.'], { stdio: 'inherit' });

            case 12:
              _context2.next = 14;
              return (0, _exec2.default)('git', ['commit', '-m', 'merge with origin/master'], { stdio: 'inherit' });

            case 14:
              _context2.next = 16;
              return (0, _exec2.default)('git', ['push'], { stdio: 'inherit' });

            case 16:
              _context2.next = 21;
              break;

            case 18:
              _context2.prev = 18;
              _context2.t0 = _context2['catch'](1);

              // Log.info('提交代码出错 ' + e);
              process.exit(1);

            case 21:
              Log.success('提交代码成功 ');

            case 22:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[1, 18]]);
    }));
  },
  publish: function publish() {
    co(regeneratorRuntime.mark(function _callee3() {
      var curBranch, publishTag, confirmConfig, publishConfig;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              curBranch = GitUtil.getCurBranch();

              if (!/^daily\/\d\.\d.\d$/.test(curBranch)) {
                Log.error('\u5F53\u524D\u5206\u652F' + curBranch + '\u4E0D\u6EE1\u8DB3x.y.z\u7684\u8981\u6C42');
                process.exit(1);
              }
              publishTag = curBranch.split('/').map(function (item) {
                if (item === 'daily') return 'publish';
                return item;
              }).join('/');
              _context3.next = 5;
              return prompt([{
                type: 'list',
                message: '\u4F60\u786E\u5B9A\u8981\u53D1\u5E03\u3010' + publishTag + '\u3011?',
                name: 'confirm',
                default: 0,
                choices: [{
                  name: '取消发布',
                  value: 0
                }, {
                  name: '确定发布',
                  value: 1
                }]
              }]);

            case 5:
              confirmConfig = _context3.sent;

              if (!confirmConfig.confirm) {
                process.exit(0);
              }
              _context3.next = 9;
              return prompt([{
                type: 'list',
                message: '本次提交的类型:',
                name: 'type',
                default: 'feat',
                choices: [{
                  name: 'feat     -     添加新功能,应该修改Y位',
                  value: 'feat'
                }, {
                  name: 'fix      -     修复BUG',
                  value: 'fix'
                }, {
                  name: 'style    -     修改代码风格,不影响组件功能',
                  value: 'style'
                }, {
                  name: 'refactor -     重构代码',
                  value: 'refactor'
                }, {
                  name: 'perf     -     组件性能优化',
                  value: 'perf'
                }, {
                  name: 'test     -     修改测试代码',
                  value: 'test'
                }, {
                  name: 'break    -    颠覆性修改，不向下兼容，注意升级版本X位',
                  value: 'break'
                }, {
                  name: 'temp     -     瞎搞一下',
                  value: 'temp'
                }]
              }, {
                type: 'input',
                message: '为了这次发布，你应该写点什么纪念一下:',
                name: 'comment',
                validate: function validate(input) {
                  if (!input) {
                    return '你不能什么都不留下';
                  }
                  return true;
                }
              }]);

            case 9:
              publishConfig = _context3.sent;
              _context3.prev = 10;
              _context3.next = 13;
              return (0, _exec2.default)('git', ['add', '-A', '.'], { stdio: 'inherit' });

            case 13:
              _context3.next = 15;
              return (0, _exec2.default)('git', ['commit', '-m', publishConfig.type + ' : ' + publishConfig.comment], { stdio: 'inherit' });

            case 15:
              _context3.next = 19;
              break;

            case 17:
              _context3.prev = 17;
              _context3.t0 = _context3['catch'](10);

            case 19:
              _context3.prev = 19;
              _context3.next = 22;
              return (0, _exec2.default)('git', ['fetch'], { stdio: 'inherit' });

            case 22:
              _context3.next = 24;
              return (0, _exec2.default)('git', ['rebase', 'origin/master'], { stdio: 'inherit' });

            case 24:
              _context3.next = 26;
              return (0, _exec2.default)('git', ['add', '-A', '.'], { stdio: 'inherit' });

            case 26:
              _context3.next = 28;
              return (0, _exec2.default)('git', ['commit', '-m', 'merge with origin/master'], { stdio: 'inherit' });

            case 28:
              _context3.next = 32;
              break;

            case 30:
              _context3.prev = 30;
              _context3.t1 = _context3['catch'](19);

            case 32:
              _context3.prev = 32;
              _context3.next = 35;
              return (0, _exec2.default)('git', ['push'], { stdio: 'inherit' });

            case 35:
              _context3.next = 37;
              return (0, _exec2.default)('lerna', ['publish'], { stdio: 'inherit' });

            case 37:
              _context3.next = 39;
              return (0, _exec2.default)('git', ['tag', publishTag], { stdio: 'inherit' });

            case 39:
              _context3.next = 41;
              return (0, _exec2.default)('git', ['push', 'origin', publishTag], { stdio: 'inherit' });

            case 41:
              _context3.next = 46;
              break;

            case 43:
              _context3.prev = 43;
              _context3.t2 = _context3['catch'](32);

              // Log.info('提交代码出错 ' + e);
              process.exit(1);

            case 46:
              Log.success('发布成功');

            case 47:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[10, 17], [19, 30], [32, 43]]);
    }));
  },
  create: function create(type, commander) {
    function addVersion(num, index) {
      if (!/^daily\/\d\.\d.\d$/.test(num)) {
        Log.error('\u5206\u652F' + num + '\u4E0D\u6EE1\u8DB3x.y.z\u7684\u8981\u6C42');
        process.exit(1);
      }
      index = index || 0;
      index = index > 2 ? 2 : index;
      var arr = num.split('\.');
      arr[arr.length - index - 1] = parseInt(arr[arr.length - index - 1]) + 1;
      return arr.join('.');
    }
    co(regeneratorRuntime.mark(function _callee4() {
      var curBranch, newBranch;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!type) {
                Log.error('Usage:Rock create [type]');
                process.exit(1);
              }

              if (!(type === 'branch')) {
                _context4.next = 30;
                break;
              }

              curBranch = GitUtil.getCurBranch();
              newBranch = addVersion(curBranch, commander.vtype);
              _context4.prev = 4;
              _context4.next = 7;
              return (0, _exec2.default)('git', ['checkout', '-b', newBranch], { stdio: 'inherit' });

            case 7:
              _context4.next = 9;
              return (0, _exec2.default)('git', ['fetch'], { stdio: 'inherit' });

            case 9:
              _context4.next = 11;
              return (0, _exec2.default)('git', ['rebase', 'origin/master'], { stdio: 'inherit' });

            case 11:
              _context4.next = 13;
              return (0, _exec2.default)('git', ['add', '-A', '.'], { stdio: 'inherit' });

            case 13:
              _context4.next = 15;
              return (0, _exec2.default)('git', ['commit', '-m', 'init ' + newBranch], { stdio: 'inherit' });

            case 15:
              _context4.next = 19;
              break;

            case 17:
              _context4.prev = 17;
              _context4.t0 = _context4['catch'](4);

            case 19:
              _context4.prev = 19;
              _context4.next = 22;
              return (0, _exec2.default)('git', ['push', '-u', 'origin', newBranch], { stdio: 'inherit' });

            case 22:
              _context4.next = 27;
              break;

            case 24:
              _context4.prev = 24;
              _context4.t1 = _context4['catch'](19);

              process.exit(1);

            case 27:
              Log.success('创建分支' + newBranch + '成功');
              _context4.next = 32;
              break;

            case 30:
              Log.error('Unknow type\u3010' + type + '\u3011');
              process.exit(1);

            case 32:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this, [[4, 17], [19, 24]]);
    }));
  }
};

exports.default = function (cmd, type, commander) {
  handler[cmd](type, commander);
};