process.env.NODE_ENV = 'production';
var path = require('path');
var baseConfig = require('./webpack.base');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractSass = new ExtractTextPlugin('[name].next.css');
var extractOther = new ExtractTextPlugin('[name].css');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var util = require('./util');
var UtilPlugin = require('./utilPlugin');

var args = require('minimist')(process.argv.slice(2));
var spawn = require('cross-spawn');
var path = require('path')
var scssMap = {};
var packages = args.packages ? args.packages.split(',') : [];
var bundleFlag = args.bundle;
var compressFlag = args.compress;
var buildPath = args.build ? '../'+args.build:'../build';
function generateConfig(entrypages){
	var publicPath = '../';
	var pages = util.getPages(null,true,'prod',entrypages)
	var config = Object.assign({},baseConfig,{
		entry: pages.entries,
		output: {
			path: path.join(__dirname,buildPath),
			publicPath: publicPath,
      filename: '[name].js', // string
      library: '[name]', // string,
      libraryTarget: 'umd', // enum
		},
		plugins: baseConfig.plugins.concat([
			new webpack.optimize.OccurrenceOrderPlugin(true),
			new webpack.DefinePlugin({
			  'process.env': {
			    'NODE_ENV': JSON.stringify('production')
			  }
			}),
			extractOther,
      extractSass,
			new OptimizeCssAssetsPlugin({
			 cssProcessor: require('cssnano'),
			 cssProcessorOptions: { discardComments: {removeAll: true },zindex:false },
			 canPrint: true
		 }),
     new UtilPlugin({
 				base:path.resolve(__dirname,'../'),
 				copy:[
 					{
 						from:'build',
 						to:'demo'
 					}
 				]
 			})
		],pages.plugins)
	})
  config.module.loaders = config.module.loaders.concat([{
      test: /\.less$/,
      loader: extractOther.extract(['css?importLoaders=2','postcss','less'])
  },
  {
    test: /@alife\/next\/.*\.scss$/,
    loader: extractSass.extract(['css?importLoaders=2','postcss','sass'])
  },
  {
    test: /.scss$/,
    exclude:/node_modules.*@alife\/next/,
    loader: extractOther.extract(['css?importLoaders=2','postcss','sass'])
  },
  {
    test: /\.css$/,
    loader: extractOther.extract(['css'])
  }]);
  if(bundleFlag){
    config.plugins.push(new BundleAnalyzerPlugin({
		}));
  }
  if(compressFlag){
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
		  compress: {
		    unused: true,
		    dead_code: true,
		    warnings: false
		  },
		  mangle: {
		    except: ['$', 'exports', 'require']
		  },
		  output: {
		    ascii_only: true
		  }
		}));
  }
	return config

}

module.exports = generateConfig(packages)
