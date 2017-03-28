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
var GitUtil = require('../../../util/git');
var Copy = require('../../../util/template-copy');

var cwd = process.cwd();
var chalk = require('chalk');
var fs = require('fs');
var Tnpm = require('../../../util/tnpm-module');

function display() {
  console.log(chalk.yellow.bgBlack('\n--------------------初始化成功,请按下面提示进行操作--------------------\n'));
  console.log(chalk.green.bgBlack(chalk.yellow('$ Rock start') + '         # 启动本地服务器，开发组件'));
  console.log(chalk.green.bgBlack(chalk.yellow('$ Rock add') + '    # 添加组件'));
  console.log(chalk.green.bgBlack(chalk.yellow('$ Rock build') + '     # 编译和打包组件'));
  console.log(chalk.green.bgBlack(chalk.yellow('$ Rock lerna') + '         # 运行lerna命令'));
  console.log(chalk.green.bgBlack(chalk.yellow('$ Rock update') + '        # 更新模板'));
  console.log(chalk.green.bgBlack(chalk.yellow('$ Rock git') + '          # git操作'));
  console.log(chalk.green.bgBlack('\n现有初始化的代码已经提交到master分支, 并已经切换到daily/0.0.1分支'));
  console.log(chalk.green.bgBlack('\n运行Rock [command] -h,可查看相关命令说明'));
  console.log(chalk.yellow.bgBlack('\n--------------------技术支持: @洛丹--------------------\n'));
}

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

function getConfig(flag) {
  var info = void 0,
      config = [{
    type: 'input',
    message: '请输入项目名',
    validate: function validate(input) {
      if (!input) {
        return '项目名不能为空';
      }
      return true;
    },
    name: 'projectName'
  }, {
    type: 'list',
    message: '请选择你要开发的组件类型',
    name: 'type',
    default: 0,
    choices: [{
      name: '业务组件',
      value: 0
    }, {
      name: '基础组件',
      value: 1
    }]
  }, {
    type: 'input',
    message: '请输入组件名称(系统会自动加上对应的前缀)',
    validate: function validate(input) {
      if (!input) {
        return '组件名不能为空';
      }
      return true;
    },
    name: 'componentName'
  }];
  if (!flag) {
    config.splice(1, 0, {
      type: 'input',
      message: '请问你是哪位(花名)',
      validate: function validate(input) {
        if (!input) {
          return '花名不能为空';
        }
        return true;
      },
      name: 'author'
    });
  }
  return prompt(config);
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
var ignoreFiles = ['node_modules', 'build', '.DS_Store', '.idea'];

exports.default = function () {
  co(regeneratorRuntime.mark(function _callee() {
    var userInfo, config, templateName, users, canCreate, projectPath, componentPath, pkgPath, npmResult, info, stream, stopFlag, timeoutId, waiting, gitUrl, ret;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            waiting = function waiting() {
              if (stopFlag) return;
              stream.write(chalk.magenta('.'));
              timeoutId = setTimeout(waiting, 1000);
            };

            _context.next = 3;
            return _util2.default.checkModules();

          case 3:
            userInfo = {};

            try {
              userInfo = GitUtil.getUserInfo();
            } catch (e) {}
            _context.next = 7;
            return getConfig(userInfo.author);

          case 7:
            config = _context.sent;
            templateName = void 0;

            config.author = userInfo.author || config.author;
            config.projectName = config.projectName.toLowerCase();
            _context.next = 13;
            return GitUtil.getUsersByGroupName('rock');

          case 13:
            users = _context.sent;
            canCreate = users.reduce(function (prev, value) {
              return value === config.author || prev;
            }, false);

            if (!canCreate) {
              Log.error('\u3010' + config.author + '\u3011\u6CA1\u6709\u6743\u9650\u5728rock\u7EC4\u4E0B\u521B\u5EFA\u4ED3\u5E93\uFF0C\u8BF7\u8054\u7CFB\u6D1B\u4E39\u4E3A\u4F60\u5F00\u901A');
              process.exit(1);
            }
            if (config.type === 0) {
              config.componentName = 'fw-' + config.componentName;
              templateName = 'business';
            } else {
              config.componentName = 'fw-com-' + config.componentName;
              templateName = 'component';
            }
            projectPath = cwd + '/' + config.projectName, componentPath = projectPath + '/packages/' + config.componentName, pkgPath = projectPath + '/lerna.json';

            if (fs.existsSync(projectPath)) {
              Log.error(config.projectName + '\u76EE\u5F55\u5DF2\u5B58\u5728\uFF0C\u521B\u5EFA\u5931\u8D25');
              process.exit(1);
            }
            npmResult = Tnpm.moduleExistSync('@ali/' + config.componentName);

            if (npmResult.exist) {
              Log.error('\u6A21\u5757\u3010@ali/' + config.componentName + '\u3011\u5DF2\u7ECF\u5B58\u5728');
              process.exit(1);
            }
            Copy.dir({
              src: path.resolve(__dirname, '../template/project'),
              dist: projectPath,
              data: {
                projectName: config.projectName,
                author: config.author,
                version: _commander.version
              },
              ignore: ignoreFiles,
              filenameTransformer: filenameTransformer
            });
            Copy.dir({
              src: path.resolve(__dirname, '../template/' + templateName),
              dist: componentPath,
              data: {
                componentName: config.componentName,
                author: config.author,
                libName: upper(config.componentName),
                version: _commander.version
              },
              ignore: ignoreFiles,
              filenameTransformer: filenameTransformer
            });
            _util2.default.addTemplate('develop', config.componentName, componentPath);
            Log.info('正在通过tnpm安装依赖包...');
            _context.prev = 25;
            _context.next = 28;
            return (0, _exec2.default)('tnpm', ['install'], {
              stdio: 'inherit',
              cwd: projectPath
            });

          case 28:
            _context.next = 35;
            break;

          case 30:
            _context.prev = 30;
            _context.t0 = _context['catch'](25);

            _context.t0 && Log.error(_context.t0);
            Log.error('tnpm 依赖安装失败，请自行排查或联系【洛丹】');
            process.exit(1);

          case 35:

            Log.info('正在初始化git本地仓库...');
            _context.prev = 36;
            _context.next = 39;
            return (0, _exec2.default)('git', ['init'], {
              stdio: 'inherit',
              cwd: projectPath
            });

          case 39:
            _context.next = 46;
            break;

          case 41:
            _context.prev = 41;
            _context.t1 = _context['catch'](36);

            _context.t1 && Log.error(_context.t1);
            Log.error('lerna bootstrap失败，请自行排查或联系【洛丹】');
            process.exit(1);

          case 46:
            Log.success('本地git仓库初始化成功');
            Log.info('lerna 正在初始化...');
            _context.prev = 48;
            _context.next = 51;
            return (0, _exec2.default)('lerna', ['init', '--independent'], {
              stdio: 'inherit',
              cwd: projectPath
            });

          case 51:
            _context.next = 53;
            return (0, _exec2.default)('lerna', ['bootstrap'], {
              stdio: 'inherit',
              cwd: projectPath
            });

          case 53:
            _context.next = 60;
            break;

          case 55:
            _context.prev = 55;
            _context.t2 = _context['catch'](48);

            _context.t2 && Log.error(_context.t2);
            Log.error('lerna 初始化失败，请自行排查或联系【洛丹】');
            process.exit(1);

          case 60:
            _util2.default.updateFileJson(pkgPath, {
              rockTemplate: 'develop'
            });
            info = GitUtil.getProjectAndGroupName(projectPath);
            stream = process.stderr;
            stopFlag = false, timeoutId = void 0;
            gitUrl = 'git@gitlab.alibaba-inc.com:' + info.groupName + '/' + info.projectName + '.git';

            stream.write(chalk.magenta('\u6B63\u5728\u521B\u5EFA\u8FDC\u7A0B\u4ED3\u5E93' + gitUrl + ',\u8BF7\u8010\u5FC3\u7B49\u5F85'));
            waiting();
            _context.prev = 67;
            _context.next = 70;
            return GitUtil.createProject(projectPath);

          case 70:
            ret = _context.sent;

            if (ret.error) {
              stream.write('\n');
              Log.error('\u8FDC\u7A0B\u4ED3\u5E93' + gitUrl + '\u521B\u5EFA\u5931\u8D25 :' + ret.error);
              timeoutId && clearTimeout(timeoutId);
              process.exit(1);
            }
            _context.next = 80;
            break;

          case 74:
            _context.prev = 74;
            _context.t3 = _context['catch'](67);

            stream.write('\n');
            Log.error('\u8FDC\u7A0B\u4ED3\u5E93' + gitUrl + '\u521B\u5EFA\u5931\u8D25');
            timeoutId && clearTimeout(timeoutId);
            process.exit(1);

          case 80:
            stream.write('\n');
            stopFlag = true;
            timeoutId && clearTimeout(timeoutId);
            Log.success('\u8FDC\u7A0B\u4ED3\u5E93' + gitUrl + '\u521B\u5EFA\u6210\u529F');
            _context.prev = 84;
            _context.next = 87;
            return (0, _exec2.default)('git', ['remote', 'add', 'origin', gitUrl], { stdio: 'inherit', cwd: projectPath });

          case 87:
            _context.next = 89;
            return (0, _exec2.default)('git', ['add', '-A', '.'], { stdio: 'inherit', cwd: projectPath });

          case 89:
            _context.next = 91;
            return (0, _exec2.default)('git', ['commit', '-m', 'init'], { stdio: 'inherit', cwd: projectPath });

          case 91:
            _context.next = 93;
            return (0, _exec2.default)('git', ['push', '-u', 'origin', 'master'], { stdio: 'inherit', cwd: projectPath });

          case 93:
            _context.next = 95;
            return (0, _exec2.default)('git', ['checkout', '-b', 'daily/0.0.1'], { stdio: 'inherit', cwd: projectPath });

          case 95:
            _context.next = 97;
            return (0, _exec2.default)('git', ['push', '-u', 'origin', 'daily/0.0.1'], { stdio: 'inherit', cwd: projectPath });

          case 97:
            _context.next = 102;
            break;

          case 99:
            _context.prev = 99;
            _context.t4 = _context['catch'](84);

            Log.success('git操作报错:' + _context.t4);

          case 102:
            display();

          case 103:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[25, 30], [36, 41], [48, 55], [67, 74], [84, 99]]);
  }));
};