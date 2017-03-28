'use strict';

var childProcess = require('child_process');
var semver = require('semver');
var Log = require('./log')(__filename);

var checkNodeVersion = function checkNodeVersion() {
  var nodeVersion;

  try {
    nodeVersion = String(childProcess.execSync('node -v'));

    if (!semver.gte(nodeVersion, '4.0.0')) {
      Log.error('您当前使用的node版本小于4.x,请升级后再使用ROCK。');
      Log.error('升级node版本可以参考：');
      Log.error('http://node.alibaba-inc.com/env/README.html');
      process.exit(0);
    }
  } catch (e) {
    Log.error(e + '\n');
  }
};
module.exports = checkNodeVersion;