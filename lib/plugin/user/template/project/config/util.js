'use strict';
var path = require('path')
var fs = require('fs')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var UtilFiles

function upper(name){
	var index = name.indexOf('\/');
	if(index > -1){
		name = name.substring(0,index);
	}
	var arr = name.split('-');
	return arr.map(function(word){
		return word.toLowerCase().replace(/^\S/g,function(s){return s.toUpperCase();});
	}).join('');
}



function checkFile(projects,name){
	if(!projects || projects.length === 0) return true
	for(var j = 0 ; j < projects.length; j++){
		if(projects[j] === '') continue
		if(new RegExp(projects[j]).test(name)){
			return true
		}
	}
	return false
}
const packExernals = {
	'react': 'React',
	'react-dom': 'ReactDOM',
	'react-redux': 'ReactRedux',
	'redux': 'Redux',
	'@ali/rock-util': 'RockUtil',
	'@ali/rock-core': 'RockCore',
	'@alife/lib-mtop':'lib',
	'reqwest':'reqwest'
}

var Util = {
	getExternals:function(){
		return packExernals;
	},
	getDirName:function(path){
		return upper(path.substring(path.lastIndexOf('\/') + 1));
	},
	getLoaders :function (){
		return [
	      {
	        test: /\.jsx?$/,
	        exclude: /node_modules/,
	        loader:'babel-loader'
	      },{
	        test:/\.(png|jpg|gif|ico|ttf|woff|woff2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
	        loader:'url-loader?limit=8192'
	      }
	    ]
	},
	getDirList:function(dir,filter){
		dir = dir || 'src';
		filter = filter || {};
		var pageDir = path.resolve(__dirname,'../'+dir)
		if(!fs.existsSync(pageDir)){
			throw new Error("can't find pages directory.")
		}
		var files = fs.readdirSync(pageDir)
		if(!files || files.length === 0){
			throw new Error("can't find any page")
		}
		files = files.filter(function(f){
			var state = fs.statSync(pageDir+'/'+f)
			return !filter[f] && state.isDirectory()
		}).map(function(f){
			return dir+'/'+f
		})
		return files
	},
	getFileList:function (){
		if(UtilFiles) return UtilFiles
		var pageDir = path.resolve(__dirname,'../src')
		if(!fs.existsSync(pageDir)){
			throw new Error("can't find pages directory.")
		}
		var files = fs.readdirSync(pageDir)
		if(!files || files.length === 0){
			throw new Error("can't find any page")
		}
		files = files.filter(function(f){
			return fs.existsSync(pageDir+'/'+f+'/index.js')
		})
		// if(files.length === 0){
		// 	throw new Error("can't find any page")
		// }
		UtilFiles = files
		return files
	},
	getResolve:function (resolve){
		resolve = resolve || {};
		var files = Util.getFileList(),fname
		for(var i = 0 ; i < files.length; i++){
			fname = files[i]
			resolve[fname] = 'src/'+fname;
		}
		return resolve
	},
	getPages : function (lib,toArray,env,filters){
		var files = Util.getFileList()
		var entries = {},fname,plugins = [],comChunks = ['vendor']
		env = env || 'dev'
		var isDev = env === 'dev'
		var targetDir = isDev ? 'demo' : 'src';
		if(lib){
			for(var libname in lib){
				entries[libname] = lib[libname]
				if(libname !== 'vendor'){
					comChunks.push(libname)
				}
			}
		}
		for(var i = 0; i < files.length; i++){
			fname = files[i]
			// if(fname.indexOf('fuwu-') !== 0 ) continue;
			if(!checkFile(filters,fname)) continue;
			var htmlName = isDev ? 'dev':'prod';
			var entryName = fname+'/index';
			if(toArray){
				entries[entryName] = ["./src/"+fname+"/index.js"]
			}else{
				entries[entryName] = "./src/"+fname+"/index.js"
			}
			let chunkArr = []
			plugins.push(new HtmlWebpackPlugin({
		      filename:fname+'/index.html',
		      template:'src/'+fname+'/'+htmlName+'.html',
		      inject:'body',
		      chunks:comChunks.concat([entryName])
		    }))
		}
		return {
			entries,
			plugins
		}
	},
	getVendors:function(filters){
		filters = filters || {};
    let packageCfg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'))),
		 libList = [];
    for (let lib in packageCfg.dependencies) {
      if (filters[lib]) continue;
			// if(packExernals[lib]) continue;
      libList.push(lib);
    }
    return libList;
	},
	getDevLib:function(){
		return [
			'url',
			'querystring',
			'babel-preset-react-hmre',
			'babel-polyfill',
			'react-proxy',
			'style-loader'
		]
	}
}
module.exports = Util
