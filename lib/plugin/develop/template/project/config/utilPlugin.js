var fs = require('fs')
var path = require('path')
var FsUtil = {
	deleteFile(src){
		if(!fs.existsSync(src)){
			return
		}
		fs.chmodSync(src, parseInt('777', 8))
		fs.unlinkSync(src)
	},
	deleteDir(srcDir){
		if(!fs.existsSync(srcDir)){
			return
		}
		var state = fs.statSync(srcDir)
		if(!state.isDirectory()){
			return FsUtil.deleteFile(srcDir)
		}
		var files = fs.readdirSync(srcDir)
		files.forEach(function(f){
			var srcpath = path.join(srcDir,f)
			var srcState = fs.statSync(srcpath)
			if(srcState.isDirectory()){
				FsUtil.deleteDir(srcpath)
			}else{
				FsUtil.deleteFile(srcpath)
			}
		})
		fs.rmdirSync(srcDir)
	},
	copyDir(srcDir,tarDir){
		var _this = this
		if(!fs.existsSync(srcDir)){
			return;
		}
		if(!fs.existsSync(tarDir)){
			fs.mkdirSync(tarDir)
		}
		var state = fs.statSync(srcDir)
		if(!state.isDirectory()){
			var msg = srcDir+` is not directory!`
			throw new Error(msg)
		}

		var files = fs.readdirSync(srcDir)
		files.forEach(function(f){
			var srcpath = path.join(srcDir,f)
			,tarpath = path.join(tarDir,f)
			var srcState = fs.statSync(srcpath)
			if(srcState.isDirectory()){
				FsUtil.copyDir(srcpath,tarpath)
			}else{
				FsUtil.copyFile(srcpath,tarpath)
			}
		})
	},
	copyFile(src,tar){
		if(!fs.existsSync(src)){
			var msg = src+` is not exists!`
			throw new Error(msg)
		}
		if(fs.existsSync(tar)){
			fs.chmodSync(tar, parseInt('777', 8))
				fs.unlinkSync(tar)
		}
		fs.writeFileSync(tar,fs.readFileSync(src))
	}
}

function UtilPlugin(options) {
	this.base = options.base
	this.rm = options.rm || []
	this.copy = options.copy || []
	this.callback = options.callback;
}

UtilPlugin.prototype.apply = function(compiler) {
  var _this = this
  // Setup callback for accessing a compilation:
  compiler.plugin("emit", function(compilation,callback) {
  	_this.rm.forEach(function(f){
  		FsUtil.deleteDir(_this.base+'/'+f)
  	})
  	// console.log('after emit')
  	callback()
  });
  compiler.plugin('done', function() {
  	_this.copy.forEach(function(f){
  		FsUtil.copyDir(_this.base+'/'+f.from,_this.base+'/'+f.to)
  	})
  	_this.callback && (_this.callback());
  	// console.log('after done')
  });
};

module.exports = UtilPlugin;
