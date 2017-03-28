var path = require('path');
var baseDir = path.resolve(__dirname,'../');
var util = require('./util');
var HappyPack = require('happypack');
var os = require('os');
var showFlag  = false;
var stream = process.stderr;
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
var autoprefixer = require('autoprefixer')();
var webpack = require('webpack');
module.exports = {
  context: baseDir,
  module: {
    loaders:[
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [ 'happypack/loader?id=jsx' ]
      },{
        test:/\.(png|jpg|gif|ico|ttf|woff|woff2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader:'url-loader?limit=8192'
      }
    ]
  },
  postcss: function(webpack) {
    return [
      autoprefixer
    ]
  },
  resolve:{
    root:baseDir,
    extensions: ['', '.js','.jsx'],
    alias:util.getResolve()
  },
  externals: util.getExternals(),
  plugins: [
    new webpack.ProgressPlugin(function handler(percentage, msg) {
				if(showFlag){
					stream.moveCursor(0,0)
					stream.clearLine()
					stream.cursorTo(0)
				}
				showFlag = true
				stream.write('当前打包进度 :'+parseInt((percentage*100).toFixed(2))+'%,'+msg)
		}),
    new HappyPack({
      id: 'jsx',
      threadPool: happyThreadPool,
      cache:true,
      cacheContext: {
        env: process.env.NODE_ENV
      },
      verbose:false,
      loaders: [ 'babel-loader' ]
    })
/*    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity
    })*/
  ]
}
