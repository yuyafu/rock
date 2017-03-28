'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _exec = require('./exec');

var _exec2 = _interopRequireDefault(_exec);

var _console = require('./console');

var _console2 = _interopRequireDefault(_console);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Log = require('./log')('util');

var co = require('co');
var cs = new _console2.default('green');
var fs = require('fs');
var path = require('path');
// const MESSAGE = [
//   【tnpm】               ${status}',
//   '【@alife/lerna】       ${status}'
// ];

var packageList = ['tnpm', 'lerna', 'gulp -v'];
var CHEKCING = '检测中...';
var INSTALL = '安装中...';
var INSTALL_FAIL = '安装失败';
var COMPLETE = '检测通过';
// const spawn = require('cross-spawn');
function change(status, curIndex, errFlag) {
  var nextStatus = status,
      nextIndex = curIndex;
  // console.log('status :', status);
  if (!status) {
    nextStatus = CHEKCING;
  }
  if (status === CHEKCING) {
    if (errFlag) {
      nextStatus = INSTALL;
    } else {
      nextStatus = COMPLETE;
    }
  } else if (status === INSTALL) {
    if (errFlag) {
      nextStatus = INSTALL_FAIL;
    } else {
      nextStatus = COMPLETE;
    }
  } else {
    nextStatus = CHEKCING;
  }
  // console.log('nextStatus :', nextStatus);
  if (nextStatus === CHEKCING) {
    nextIndex = nextIndex || 0;
    cs.log(packageList[nextIndex] + '      ' + nextStatus);
  } else if (nextStatus === INSTALL_FAIL) {
    cs.log(packageList[nextIndex] + '      ' + nextStatus);
    process.exit(1);
  } else if (nextStatus === COMPLETE) {
    cs.log(packageList[nextIndex] + '      ' + nextStatus + '\n');
    nextIndex++;
  } else {
    cs.log(packageList[nextIndex] + '      ' + nextStatus);
  }
  return {
    state: nextStatus,
    curIndex: nextIndex,
    cmd: packageList[nextIndex]
  };
}

var packageMap = {
  'tnpm': [['npm', 'install', '-g', 'tnpm', '--registry=http://registry.npm.alibaba-inc.com']],
  'lerna': [['tnpm', 'install', '-g', '@alife/lerna']],
  'gulp': [['tnpm', 'install', '-g', 'gulp']]
};

var rockJsonPath = path.resolve(process.env.HOME, './.rock.json');

var Util = {

  checkModules: function checkModules() {
    return co(regeneratorRuntime.mark(function _callee() {
      var stat, strList;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              stat = {};

            case 1:
              if (!(!stat.curIndex || stat.curIndex < packageList.length)) {
                _context.next = 24;
                break;
              }

              stat = change(stat.state, stat.curIndex);
              strList = stat.cmd.split(/\s+/);
              _context.prev = 4;
              _context.next = 7;
              return (0, _exec2.default)(strList[0], strList.length > 1 ? strList.slice(1) : []);

            case 7:
              _context.next = 21;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context['catch'](4);

              stat = change(stat.state, stat.curIndex, true);
              _context.prev = 12;
              _context.next = 15;
              return _exec2.default.apply(undefined, ['sudo'].concat(_toConsumableArray(packageMap[strList[0]])));

            case 15:
              _context.next = 21;
              break;

            case 17:
              _context.prev = 17;
              _context.t1 = _context['catch'](12);

              stat = change(stat.state, stat.curIndex, true);
              return _context.abrupt('return');

            case 21:
              stat = change(stat.state, stat.curIndex);
              _context.next = 1;
              break;

            case 24:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[4, 9], [12, 17]]);
    }));
  },
  getCurVersion: function getCurVersion() {
    return require('../../package.json').version;
  },
  getMaxVersion: function getMaxVersion(pkg) {
    return new Promise(function (resolve, reject) {
      (0, _exec.runWithResult)(pkg).then(function (resp) {
        var varr = JSON.parse(resp.replace(/'/g, '"'));
        resolve(varr[varr.length - 1]);
      }).catch(function (e) {
        console.log('e :', e);
        reject(e);
      });
    });
  },
  readFileJson: function readFileJson(path) {
    if (!fs.existsSync(path)) {
      Log.error('\u6587\u4EF6\u3010' + path + '\u3011\u4E0D\u5B58\u5728');
      process.exit(1);
    }
    var content = fs.readFileSync(path),
        ret = void 0;
    try {
      ret = JSON.parse(content);
    } catch (e) {
      Log.error(path + ' JSON\u683C\u5F0F\u6709\u8BEF,\u89E3\u6790\u5931\u8D25');
    }
    return ret;
  },
  getPages: function getPages(dir) {
    var dirPath = path.resolve(dir, './src');
    if (!fs.existsSync(dirPath)) {
      return [];
    }
    var files = fs.readdirSync(dirPath);
    if (!files || files.length === 0) {
      return [];
    }
    return files.map(function (file) {
      var fileName = file.substring(file.lastIndexOf('/') + 1);
      return {
        name: fileName,
        value: fileName
      };
    });
  },
  addTemplate: function addTemplate(key, name, path) {
    var content = {};
    if (fs.existsSync(rockJsonPath)) {
      content = Util.readFileJson(rockJsonPath);
    }
    if (!content[key]) {
      content[key] = [];
    }
    var hasRegister = content[key].reduce(function (prev, cur) {
      return prev || cur.name === name && cur.path === path;
    }, false);
    !hasRegister && content[key].push({
      name: name,
      path: path
    });
    Util.writeFileJson(rockJsonPath, content);
  },
  getTemplates: function getTemplates(key) {
    var content = {};
    if (fs.existsSync(rockJsonPath)) {
      content = Util.readFileJson(rockJsonPath);
    }
    if (!content[key]) return [];
    content[key] = content[key].filter(function (item) {
      return fs.existsSync(item.path);
    });
    Util.writeFileJson(rockJsonPath, content);
    return content[key];
  },
  updateFileJson: function updateFileJson(path, json) {
    if ((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object') {
      json = path;
      path = process.cwd() + '/package.json';
    }
    var content = Util.readFileJson(path),
        newContent = Object.assign({}, content, json);
    // console.log('content :', content);
    // console.log('newContent :', newContent);
    Util.writeFileJson(path, newContent);
  },
  writeFileJson: function writeFileJson(path, json) {
    var content = JSON.stringify(json, null, '  ');
    try {
      fs.writeFileSync(path, content);
    } catch (e) {
      Log.error(path + ' \u5199\u5165\u5185\u5BB9\u51FA\u9519');
      process.exit(1);
    }
  }
};

exports.default = Util;