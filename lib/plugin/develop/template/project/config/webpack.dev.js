
var path = require('path');
var baseConfig = require('./webpack.base');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var util = require('./util');



var path = require('path')
var scssMap = {}

module.exports = function(port,entrypages){
	var publicPath = '/';
	var pages = util.getPages(null,true,'dev',entrypages)
	var config = Object.assign({},baseConfig,{
		entry: pages.entries,
		output: {
			path: path.join(__dirname,'../build'),
			publicPath: publicPath,
			filename: '[name].js'
		},
		devServer:{
		    hot: true,
		    publicPath: publicPath,
		    contentBase:'/',
		    historyApiFallback:true,
		    noInfo:false,
		    port:port,
		    inline: true
		},
		plugins: baseConfig.plugins.concat([
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NoErrorsPlugin(),
			new webpack.DefinePlugin({
			  'process.env': {
			    'NODE_ENV': JSON.stringify('development')
			  }
			}),
			new ExtractTextPlugin('[name].css', {
		      allChunks: true
		    }),
			new OptimizeCssAssetsPlugin({
			 cssProcessor: require('cssnano'),
			 cssProcessorOptions: { discardComments: {removeAll: true },zindex:false },
			 canPrint: true
		 }),
			new webpack.SourceMapDevToolPlugin({}),
			new webpack.DllReferencePlugin({
          context: path.resolve(__dirname),
          manifest: require('../ddl/manifest.json'),
      })
		],pages.plugins)
	})
	config.module.loaders = config.module.loaders.concat([{
	    test: /\.less$/,
	    loader: 'style-loader?singleton!css-loader!postcss-loader!less-loader'
	},{
		test: /^((?!@alife\/next)).*\.scss$/,
		loader: 'style-loader?singleton!css-loader!postcss-loader!sass-loader'
	},{
		test: /\@alife\/next\/.*\.scss$/,
		loader: ExtractTextPlugin.extract('style', 'css-loader!postcss-loader!sass-loader')
	},
	{
		test: /\.css$/,
		loader: 'style-loader?singleton!css-loader'
	}]);
	return config

}
