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
  var port = commander.port,
      page = commander.page;

  var pkg = commander.package;
  var exeOpr = ['bin/server'];
  port && exeOpr.push('--port=' + port);
  page && exeOpr.push('--defaultPage=' + page);
  pkg && (exeOpr = exeOpr.concat(pkg.split(',')));
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