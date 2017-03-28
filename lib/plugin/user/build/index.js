'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _exec = require('../../../util/exec');

var _exec2 = _interopRequireDefault(_exec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var co = require('co');

exports.default = function () {
  var _ref;

  var commander = (_ref = arguments.length - 1, arguments.length <= _ref ? undefined : arguments[_ref]);
  var compress = commander.compress,
      bundle = commander.bundle,
      build = commander.build;

  var pkg = commander.package;
  var exeOpr = ['bin/build.js'];
  compress && exeOpr.push('--compress');
  bundle && exeOpr.push('--bundle');
  pkg && exeOpr.push('--package=' + pkg);
  build && exeOpr.push('--build=' + build);
  co(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _exec2.default)('node', exeOpr, { stdio: 'inherit' });

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
};