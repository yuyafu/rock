'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../../../util');

var _util2 = _interopRequireDefault(_util);

var _exec = require('../../../util/exec');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Log = require('../../../util/log')('Rock');

var co = require('co');
var spawn = require('cross-spawn');
var stream = process.stdout;

exports.default = function () {
  co(regeneratorRuntime.mark(function _callee() {
    var data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _exec.runWithResult)('@ali/rock');

          case 2:
            data = _context.sent;

            console.log('data :', data);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
};