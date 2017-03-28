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
var Tnpm = require('../../../util/tnpm-module');

var cwd = process.cwd();
var chalk = require('chalk');
var fs = require('fs');

function getConfig() {
  return prompt([{
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

exports.default = function () {
  co(regeneratorRuntime.mark(function _callee() {
    var config, templateName, npmResult, pkgJSON, componentPath;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getConfig();

          case 2:
            config = _context.sent;
            templateName = void 0;

            if (config.type === 0) {
              config.componentName = 'fw-' + config.componentName;
              templateName = 'business';
            } else {
              config.componentName = 'fw-com-' + config.componentName;
              templateName = 'component';
            }
            npmResult = Tnpm.moduleExistSync('@ali/' + config.componentName);

            if (npmResult.exist) {
              Log.error('\u6A21\u5757\u3010@ali/' + config.componentName + '\u3011\u5DF2\u7ECF\u5B58\u5728');
              process.exit(1);
            }
            pkgJSON = _util2.default.readFileJson(cwd + '/package.json');

            config.projectName = pkgJSON.name;
            config.author = pkgJSON.author;
            componentPath = cwd + '/packages/' + config.componentName;

            if (fs.existsSync(componentPath)) {
              Log.error(config.componentName + '\u7EC4\u4EF6\u5DF2\u5B58\u5728\uFF0C\u521B\u5EFA\u5931\u8D25');
              process.exit(1);
            }
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

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
};