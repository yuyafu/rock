'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _commander = require('./config/commander');

var _commander2 = _interopRequireDefault(_commander);

var _templateCopy = require('./util/template-copy');

var _templateCopy2 = _interopRequireDefault(_templateCopy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fs = require('fs');
var RUN_DIR = process.cwd();
var CONFIG_FILE = RUN_DIR + '/lerna.json';
var path = require('path');

// import Util from './util';
var Log = require('./util/log')(__filename);
var PLUGIN_PATH = path.resolve(__dirname, './plugin');

var program = require('commander');
var param = process.argv.slice(2);
var argv = require('minimist')(param);

exports.default = {
  run: function run() {
    this.registerLocalPlugins();
    this.handle(param[0], param[1]);
    // CommanderHandler.handle(this.pluginMap, ...param);
    // this.registerCommander();
  },
  handle: function handle(cmd, template) {
    var pluginName = this.getCurPlugin(cmd, template),
        curPlugin = void 0;
    if (pluginName) {
      curPlugin = this.pluginMap[pluginName];
    }
    if (cmd && cmd.indexOf('-') !== 0) {
      if (pluginName) {
        if (!curPlugin) {
          Log.error('\u4E0D\u5B58\u5728\u3010' + pluginName + '\u3011\u8FD9\u4E2A\u6A21\u677F');
          process.exit(1);
        }
        if (pluginName === template) {
          curPlugin.apply(undefined, _toConsumableArray(process.argv.slice(0, 3)).concat(_toConsumableArray(process.argv.slice(4))));
        } else {
          curPlugin.apply(undefined, _toConsumableArray(process.argv));
        }
        return;
      }
    }
    this.registerCommander(curPlugin);
  },
  getCurPlugin: function getCurPlugin(cmd, template) {
    var exists = fs.existsSync(CONFIG_FILE);
    if (cmd === 'init' || cmd === 'i') {
      if (exists) {
        Log.error('当前目录已经被初始化');
        process.exit(1);
      }
      return template;
    } else if (!exists && cmd) {
      // Log.error('请先初始化项目');
      // process.exit(1);
    } else if (exists) {
      var contentStr = fs.readFileSync(CONFIG_FILE, { encoding: 'utf-8' });
      var content = JSON.parse(contentStr);
      return content.rockTemplate;
    }
  },
  registerCommander: function registerCommander(curPlugin) {
    if (curPlugin) {
      curPlugin();
      return;
    }
    program.version(require('../package').version);
    program.usage('<command>');
    _commander2.default.forEach(function (item) {
      if (item.name === 'init' || item.name === 'i') return;
      var command = program.command(item.argument ? item.name + ' ' + item.argument : item.name).description(item.description).alias(item.alias);
      item.options && item.options.forEach(function (opt) {
        command = command.option(opt.name, opt.desc);
      });
      command = command.action(function () {
        var _require;

        (_require = require('./' + item.name + '/index')).default.apply(_require, arguments);
      });
    });
    program.parse(process.argv);
    if (!program.args.length) {
      program.help();
    }
  },
  registerLocalPlugins: function registerLocalPlugins() {
    var _this = this;

    this.pluginMap = {};
    var dirs = _templateCopy2.default.getDirectories(PLUGIN_PATH);
    if (dirs) {
      dirs.forEach(function (dir) {
        _this.pluginMap[dir] = require('./plugin/' + dir).default;
      });
    }
  },
  registerPlugin: function registerPlugin() {
    var plugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    this.pluginMap = plugins;
  },
  checkPlugin: function checkPlugin(moduleName) {}
};