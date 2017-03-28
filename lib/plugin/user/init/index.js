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

var Log = require('../../../util/log')('init');
var GitUtil = require('../../../util/git');
var Copy = require('../../../util/template-copy');
var Tnpm = require('../../../util/tnpm-module');

var cwd = process.cwd();
var chalk = require('chalk');
var fs = require('fs');

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

function display() {
  console.log(chalk.yellow.bgBlack('\n--------------------初始化成功,请按下面提示进行操作--------------------\n'));
  console.log(chalk.green.bgBlack(chalk.yellow('$ Rock start') + '         # 启动本地服务器，开发组件'));
  console.log(chalk.green.bgBlack(chalk.yellow('$ Rock add [type]') + '    # 添加页面或组件'));
  console.log(chalk.green.bgBlack(chalk.yellow('$ Rock build') + '     # 编译和打包组件'));
  console.log(chalk.green.bgBlack('\n运行Rock [command] -h,可查看相关命令说明'));
  console.log(chalk.yellow.bgBlack('\n--------------------技术支持: @洛丹--------------------\n'));
}
var ignoreFiles = ['node_modules', 'build', '.DS_Store', '.idea'];

exports.default = function (commander) {
  co(regeneratorRuntime.mark(function _callee() {
    var projectPath, pkgPath, userInfo, cwdName;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // let pkgJSON = Util.readFileJson(`${cwd}/package.json`);
            projectPath = cwd + '/rock', pkgPath = projectPath + '/lerna.json';

            if (fs.existsSync(projectPath)) {
              Log.error('当前目录下已经存在rock工作区');
              process.exit(1);
            }
            userInfo = void 0;

            try {
              userInfo = GitUtil.getUserInfo();
            } catch (e) {}
            Copy.dir({
              src: path.resolve(__dirname, '../template/project'),
              dist: projectPath,
              data: {
                // componentName: config.componentName,
                author: userInfo.author || 'unkown',
                // libName: upper(config.componentName),
                version: _commander.version
              },
              ignore: ignoreFiles,
              filenameTransformer: filenameTransformer
            });

            cwdName = cwd.substring(cwd.lastIndexOf('/') + 1);

            _util2.default.addTemplate('user', cwdName, projectPath);
            _util2.default.updateFileJson(pkgPath, {
              rockTemplate: 'user'
            });
            // Log.info('正在通过tnpm安装依赖包...');
            // try {
            //   yield Exec('tnpm', ['install'], {
            //     stdio: 'inherit',
            //     cwd: projectPath
            //   });
            // } catch (e) {
            //   e && Log.error(e);
            //   Log.error('tnpm 依赖安装失败，请自行排查或联系【洛丹】');
            //   process.exit(1);
            // }
            // try {
            //   const scriptPath = `${cwd}/src/index.js`;
            //   let entryScript = fs.readFileSync(scriptPath);
            //   entryScript += `import './${config.componentName}/index';\n`;
            //   fs.writeFileSync(scriptPath);
            // } catch (e) {
            //   Log.error(e);
            // }
            display();

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
};