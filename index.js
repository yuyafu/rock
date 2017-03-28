#!/usr/bin/env node --harmony
'use strict';

var Rock = require('../lib').default;
var effectiveUser = process.env.USER;
var actualUser = process.env.SUDO_USER || process.env.USER;

var chalk = require('chalk');

// 禁止 sudo 执行 fie 命令
if (effectiveUser === 'root' && actualUser !== 'root') {
  console.log(chalk.red('[ERROR] 请勿使用 sudo 执行 rock ，以免污染文件权限。rock 将退出！'));
  process.exit(1);
}

Rock.run();
