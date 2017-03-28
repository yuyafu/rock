'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _exec = require('../../../util/exec');

var _exec2 = _interopRequireDefault(_exec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var co = require('co');
var os = require('os');
var len = os.cpus().length;

exports.default = function (script, cmd, commander) {
  var scope = commander.scope,
      ignore = commander.ignore;

  var execOpt = [script, '--concurrency', len];
  scope && (execOpt = execOpt.concat(['--scope', scope]));
  ignore && (execOpt = execOpt.concat(['--ignore', ignore]));
  co(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _exec2.default)('lerna', execOpt.concat(cmd), { stdio: 'inherit' });

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
};