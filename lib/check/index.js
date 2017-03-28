'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var co = require('co');

var Log = require('../util/log')('check');

exports.default = function () {
  co(regeneratorRuntime.mark(function _callee() {
    var curVersion, maxVersion;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            curVersion = _util2.default.getCurVersion(), maxVersion = void 0;
            _context.prev = 1;
            _context.next = 4;
            return _util2.default.getMaxVersion('@ali/rock');

          case 4:
            maxVersion = _context.sent;
            _context.next = 9;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](1);

          case 9:
            if (curVersion !== maxVersion) {
              Log.info('\u5F53\u524D\u4F7F\u7528\u7684rock\u7248\u672C\u662F\u3010' + curVersion + '\u3011,\u6700\u65B0\u7248\u672C\u4E3A\u3010' + maxVersion + '\u3011,\u8BF7\u66F4\u65B0\u4F53\u9A8C\u66F4\u591A\u7684\u529F\u80FD');
            } else {
              Log.info('\u5F53\u524D\u4F7F\u7528\u7684rock\u7248\u672C\u3010' + curVersion + '\u3011\u5DF2\u7ECF\u662F\u6700\u65B0\u7248\u672C');
            }

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 7]]);
  }));
};