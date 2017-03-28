'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runWithResult = runWithResult;
var spawn = require('cross-spawn');

function runWithResult(pkg) {
  var ps = spawn('tnpm', ['view', pkg, 'versions']);
  return new Promise(function (resolve, reject) {
    var data = '';
    ps.stdout.on('data', function (s) {
      data += s;
    });
    ps.stderr.on('data', function (s) {
      data += s;
    });
    ps.on('error', function () {
      reject();
    });
    ps.on('close', function (status) {
      if (status !== 0) {
        reject();
      } else {
        resolve(data);
      }
    });
  });
}

exports.default = function (cmd, args, option) {
  if (Object.prototype.toString.call(args) !== '[object Array]') {
    option = args;
    args = [];
  }
  var ps = spawn(cmd, args || [], option);
  return new Promise(function (resolve, reject) {
    ps.on('error', function () {
      reject();
    });
    ps.on('close', function (status) {
      if (status !== 0) {
        reject();
      } else {
        resolve();
      }
    });
  });
};