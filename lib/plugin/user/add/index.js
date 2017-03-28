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

var Log = require('../../../util/log')('add');
var Copy = require('../../../util/template-copy');
var Tnpm = require('../../../util/tnpm-module');

var cwd = process.cwd();
var chalk = require('chalk');
var fs = require('fs');

function getConfig() {
  var pages = _util2.default.getPages(cwd);
  if (pages.length === 0) {
    Log.error('当前项目还没有页面，请运行【rock add page】来新增页面');
    process.exit(1);
  }
  return prompt([{
    type: 'list',
    message: '请选择页面',
    name: 'page',
    default: 0,
    choices: pages
  }, {
    type: 'input',
    message: '\u8BF7\u8F93\u5165\u4F60\u8981\u4F7F\u7528\u7684\u4E1A\u52A1\u7EC4\u4EF6\u540D(\u53BB\u6389\u3010' + chalk.magenta('@ali/fw-') + '\u3011\u7684\u524D\u7F00)',
    name: 'componentName',
    validate: function validate(input) {
      if (!input) {
        return '组件名不能为空';
      }
      return true;
    }
  }]);
}

function getPageConfig() {
  return prompt([{
    type: 'input',
    message: '请输入页面名称',
    validate: function validate(input) {
      if (!input) {
        return '页面名不能为空';
      }
      return true;
    },
    name: 'pageName'
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
var ignoreFiles = ['node_modules', 'build', '.DS_Store', '.idea'];

exports.default = function (type, commander) {
  var edition = commander.edition;

  edition = edition || '';
  return co(regeneratorRuntime.mark(function _callee() {
    var config, pkgPath, npmResult, pagePath, componentPath, scriptPath, entryScript, lernaConfig, npmName, _config, pageName, _pagePath;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(type === 'component')) {
              _context.next = 33;
              break;
            }

            _context.next = 3;
            return getConfig();

          case 3:
            config = _context.sent;
            pkgPath = cwd + '/lerna.json';

            config.componentName = 'fw-' + config.componentName;
            npmResult = Tnpm.moduleExistSync('@ali/' + config.componentName);

            if (!npmResult.exist) {
              Log.error('\u6A21\u5757\u3010@ali/' + config.componentName + '\u3011\u4E0D\u5B58\u5728');
              process.exit(1);
            }
            // let pkgJSON = Util.readFileJson(`${cwd}/package.json`);
            pagePath = cwd + '/src/' + config.page;
            componentPath = pagePath + '/' + config.componentName;

            if (fs.existsSync(componentPath)) {
              Log.error(config.componentName + '\u7EC4\u4EF6\u5DF2\u5B58\u5728\uFF0C\u521B\u5EFA\u5931\u8D25');
              process.exit(1);
            }
            Copy.dir({
              src: path.resolve(__dirname, '../template/component'),
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
            try {
              scriptPath = pagePath + '/index.js';
              entryScript = fs.readFileSync(scriptPath);

              entryScript += 'import \'./' + config.componentName + '/index\';\n';
              fs.writeFileSync(scriptPath, entryScript);
            } catch (e) {
              Log.error(e);
            }
            lernaConfig = _util2.default.readFileJson(pkgPath);

            lernaConfig.componentMap = lernaConfig.componentMap || {};
            npmName = edition ? config.componentName + '@' + edition : config.componentName;

            if (lernaConfig.componentMap[config.componentName]) {
              _context.next = 30;
              break;
            }

            Log.info('\u6B63\u5728\u901A\u8FC7tnpm\u5B89\u88C5\u3010' + ('@ali/' + npmName) + '\u3011');
            _context.prev = 18;
            _context.next = 21;
            return (0, _exec2.default)('tnpm', ['install', '@ali/' + npmName, '-S'], {
              stdio: 'inherit',
              cwd: cwd
            });

          case 21:
            _context.next = 28;
            break;

          case 23:
            _context.prev = 23;
            _context.t0 = _context['catch'](18);

            _context.t0 && Log.error(_context.t0);
            Log.error('tnpm 依赖安装失败，请自行排查或联系【洛丹】');
            process.exit(1);

          case 28:
            lernaConfig.componentMap[config.componentName] = config.componentName;
            _util2.default.writeFileJson(pkgPath, lernaConfig);

          case 30:
            Log.success('\u521B\u5EFA\u7EC4\u4EF6\u3010' + npmName + '\u3011\u6210\u529F');
            _context.next = 46;
            break;

          case 33:
            if (!(type === 'page')) {
              _context.next = 44;
              break;
            }

            _context.next = 36;
            return getPageConfig();

          case 36:
            _config = _context.sent;
            pageName = _config.pageName;

            // let pkgJSON = Util.readFileJson(`${cwd}/package.json`);

            _pagePath = cwd + '/src/' + pageName;

            if (fs.existsSync(_pagePath)) {
              Log.error(_pagePath + '\u9875\u9762\u5DF2\u5B58\u5728\uFF0C\u521B\u5EFA\u5931\u8D25');
              process.exit(1);
            }
            Copy.dir({
              src: path.resolve(__dirname, '../template/page'),
              dist: _pagePath,
              data: {
                pageName: pageName,
                author: _config.author,
                version: _commander.version
              },
              ignore: ignoreFiles,
              filenameTransformer: filenameTransformer
            });
            Log.success('\u9875\u9762\u3010' + pageName + '\u3011\u521B\u5EFA\u6210\u529F');
            _context.next = 46;
            break;

          case 44:
            Log.error('unknow type');
            process.exit(1);

          case 46:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[18, 23]]);
  }));
};