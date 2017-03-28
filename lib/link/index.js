'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

var _templateCopy = require('../util/template-copy');

var _templateCopy2 = _interopRequireDefault(_templateCopy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var co = require('co');

var Log = require('../util/log')('link');
var inquirer = require('inquirer');
var path = require('path');
var fs = require('fs');
var cwd = process.cwd();
var prompt = inquirer.createPromptModule();

exports.default = function (type) {
  if (type === 'show') {
    var linkArray = _util2.default.getTemplates('link');
    if (linkArray.length === 0) {
      Log.info('没数据');
    } else {
      linkArray.forEach(function (item) {
        Log.info(item.name + ' => ' + item.path);
      });
    }

    return;
  }
  co(regeneratorRuntime.mark(function _callee() {
    var list, choices, nodeModulesPath, _ref, confirm, _ref2, componentPath, npmScope, lastIndex, componentName, linkPath;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            list = _util2.default.getTemplates('develop');
            choices = list.map(function (item) {
              return {
                name: item.name,
                value: item.path
              };
            });

            if (choices.length === 0) {
              Log.info('rock在本机上未找到你开发过的业务组件');
              process.exit(1);
            }
            nodeModulesPath = path.resolve(cwd, 'node_modules');

            if (fs.existsSync(nodeModulesPath)) {
              _context.next = 11;
              break;
            }

            _context.next = 8;
            return prompt([{
              type: 'list',
              message: '发现该目录下没有node_modules目录,确认的话，rock就为你创建node_modules',
              name: 'confirm',
              default: 0,
              choices: [{
                name: '退出',
                value: 0
              }, {
                name: '创建node_modules',
                value: 1
              }]
            }]);

          case 8:
            _ref = _context.sent;
            confirm = _ref.confirm;

            if (confirm) {
              fs.mkdirSync(nodeModulesPath);
              Log.info('node_modules创建成功');
            } else {
              process.exit(0);
            }

          case 11:
            _context.next = 13;
            return prompt([{
              type: 'list',
              message: '请选择你要接入的业务组件',
              name: 'componentPath',
              default: choices[0].value,
              choices: choices
            }]);

          case 13:
            _ref2 = _context.sent;
            componentPath = _ref2.componentPath;
            npmScope = nodeModulesPath + '/@ali';

            if (!fs.existsSync(npmScope)) {
              fs.mkdirSync(npmScope);
            }
            lastIndex = componentPath.lastIndexOf('/');
            componentName = componentPath.substring(lastIndex + 1);
            linkPath = npmScope + '/' + componentName;

            if (fs.existsSync(linkPath)) {
              Log.info(linkPath + '\u5DF2\u5B58\u5728');
              process.exit(1);
            }
            _context.prev = 21;
            _context.next = 24;
            return _templateCopy2.default.symlink(componentPath, linkPath);

          case 24:
            _context.next = 30;
            break;

          case 26:
            _context.prev = 26;
            _context.t0 = _context['catch'](21);

            Log.error(_context.t0);
            process.exit(1);

          case 30:
            _util2.default.addTemplate('link', linkPath, componentPath);
            Log.success('link\u3010' + componentName + '\u3011\u6210\u529F');
            _context.next = 36;
            break;

          case 34:
            _context.prev = 34;
            _context.t1 = _context['catch'](0);

          case 36:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 34], [21, 26]]);
  }));
};