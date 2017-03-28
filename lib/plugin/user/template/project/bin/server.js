


var process = require('process');
var spawn = require('cross-spawn');
var args = require('minimist')(process.argv.slice(2));

function list_equal(src, tar) {
  if (src.length !== tar.length) return false;
  var libMap = {};
  src.forEach(function(name) {
    libMap[name] = true;
  });
  for (var i = 0; i < tar.length; i++) {
    if (!libMap[tar[i]]) return false;
  }
  return true;
}

// var exec = require('child_process').exec;

var util = require('../config/util');
var fs = require('fs');
var path = require('path');
var packagePath = path.resolve(__dirname, '../lerna.json');
var rockCfg = JSON.parse(fs.readFileSync(packagePath));
var vendors = util.getVendors();
if (!rockCfg.dependencies || !list_equal(rockCfg.dependencies, vendors)) {
  var spawnResult = spawn.sync('npm', ['run', 'lib'], {stdio: 'inherit'});
  if (spawnResult.error) {
    process.exit(1);
  }
  rockCfg.dependencies = vendors;
  fs.writeFileAsync(packagePath, JSON.stringify(rockCfg, null, '  '));
}

var port = args.port || 8088;
var defailtHtmlName = args.defaultPage;
var filters = args._;
var config = require('../config/webpack.dev')(port, filters);
var open = require('open');
var host = 'http://localhost:' + port + config.devServer.publicPath;
var webpack = require('webpack');
var path = require('path');
var express = require('express');
var app = express();
var startFlag = false;
for (var name in config.entry) {
	// config.entry[name].unshift("webpack-dev-server/client?"+host, "webpack/hot/only-dev-server");  需要自己刷新
  config.entry[name].unshift('webpack-hot-middleware/client?reload=true');
  if (!defailtHtmlName) defailtHtmlName = name.substr(0, name.indexOf('/'));
}
var compiler = webpack(config);
host = host + defailtHtmlName + '/index.html';
compiler.plugin('done', function() {
  if (startFlag) return;
  startFlag = true;
  open(host, function(err) {

  });
});
console.log('Enabling webpack dev middleware.');
app.use(require('webpack-dev-middleware')(compiler, {
  lazy: false,
  noInfo: false,
  publicPath: config.devServer.publicPath,
  quiet: false,
  stats: {
  	colors: true
  }
}));
console.log('Enabling Webpack Hot Module Replacement (HMR).');
app.use(require('webpack-hot-middleware')(compiler));
console.log('path ==> ', path.resolve(__dirname, config.devServer.contentBase));
app.use(express.static(path.resolve(__dirname, config.devServer.contentBase)));
app.use('/static', express.static(path.resolve(__dirname, '../')));
app.listen(port, () => {
  console.log('listening on ' + host + '....');
});
