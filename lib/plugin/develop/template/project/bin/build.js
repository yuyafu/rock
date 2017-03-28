var spawn = require('cross-spawn');
var fs = require('fs');
var path = require('path');
var args = require('minimist')(process.argv.slice(2));
var cwd = process.cwd();
var chalk = require('chalk');
var filters = args.package ? args.package.split(',') : [],
  compress = args.compress,
  bundle = args.bundle;

var wpArg = ['--config', './config/webpack.prod.js'];
compress && (wpArg.push('--compress'));
bundle && (wpArg.push('--bundle'));
filters && (wpArg.push('--packages=' + filters));

var util = require('../config/util');
var pages = util.getPages(null, true, 'prod', filters);
var allLintPages = [];
for (var name in pages.entries) {
  allLintPages = allLintPages.concat(pages.entries[name]);
}

var ps = spawn('./node_modules/.bin/eslint', ['--fix', '--quiet'].concat(allLintPages), {
  cwd: cwd,
  stdio: 'inherit'
});
ps.on('close', function(status) {
  if (status !== 0) {
    process.exit(1);
  }
  console.log(chalk.green('【eslint】审查' + allLintPages + '   通过'));
  // console.log('wpArg :', wpArg);
  spawn.sync('webpack', wpArg, {
    cwd: cwd,
    stdio: 'inherit'
  });
});
