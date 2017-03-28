'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stream = process.stderr;
var chalk = require('chalk');

var Console = function () {
  function Console(color) {
    _classCallCheck(this, Console);

    this.flag = false;
    this.color = color;
  }

  _createClass(Console, [{
    key: 'log',
    value: function log(message, color) {
      if (this.flag) {
        stream.moveCursor(0, 0);
        stream.clearLine();
        stream.cursorTo(0);
      }
      var tmpColor = color || this.color;
      tmpColor && (message = chalk[tmpColor](message));
      stream.write(message);
      this.flag = true;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.flag = false;
    }
  }]);

  return Console;
}();

exports.default = Console;