'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commander = require('./config/commander');

var _commander2 = _interopRequireDefault(_commander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var program = require('commander');

exports.default = function () {
  for (var _len = arguments.length, param = Array(_len), _key = 0; _key < _len; _key++) {
    param[_key] = arguments[_key];
  }

  program.version(require('../../../package').version);
  program.usage('<command>');
  _commander2.default.forEach(function (item) {
    var command = program.command(item.argument ? item.name + ' ' + item.argument : item.name).description(item.description).alias(item.alias);
    item.options && item.options.forEach(function (opt) {
      command = command.option(opt.name, opt.desc);
    });
    command = command.action(function () {
      var _require;

      (_require = require('./' + item.name + '/index')).default.apply(_require, arguments);
    });
  });
  program.parse(param);
  if (!param.length) {
    program.help();
  }
};