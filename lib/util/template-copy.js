/**
 * genterator 接口
 * @author 擎空 <zhenwu.czw@alibaba-inc.com>
 */
'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var _ = require('underscore');
var log = require('./log')('template-copy');
var resolve = path.resolve,
    dirname = path.dirname,
    relative = path.relative;

_.templateSettings = {
  evaluate: /<{%([\s\S]+?)%}>/g,
  interpolate: /<{%=([\s\S]+?)%}>/g,
  escape: /<{%-([\s\S]+?)%}>/g
};

var TemplateCopy = {

  /**
   * 复制目录
   * 支持 underscore 模板引擎, 标签开始和结束符是: <{% %}>
   * @param options
   * @param options.src 绝对路径
   * @param options.dist 绝对路径
   * @param options.data
   * @param options.ignore 数组, 类似 gitignore 的写法
   * @param options.sstrReplace 数组 , 将文件里面匹配到的字符串替换掉,如 [ { str: 'developong-project-name', replacer: 'demo' } ]
   * @param options.filenameTransformer 函数, 文件名转换函数列表
   * @param options.templateSettings   详细使用请查看 underscore 的templateSettings, 默认为:{
     *                                                                  evaluate: /<{%([\s\S]+?)%}>/g,
     *                                                                  interpolate: /<{%=([\s\S]+?)%}>/g,
     *                                                                  escape: /<{%-([\s\S]+?)%}>/g
     *                                                              }
   * @param options.encoding   默认 utf-8
   */
  dir: function dir(options) {

    var _recursiveDir;

    options = options || {};

    if (!options.src || !options.dist) {
      log.error('请传入源文件目录路径 和 目标目录路径');
      return;
    }

    if (!fs.existsSync(options.src)) {
      log.error('源文件目录不存在');
      return;
    }

    options.data = options.data || {};
    options.ignore = options.ignore || ['node_modules', '.DS_Store', '.idea'];
    options.sstrReplace = options.sstrReplace || [];
    options.filenameTransformer = options.filenameTransformer || function (a) {
      return a;
    };

    // 开发者可以自定义模板标签类型
    if (options.templateSettings) {
      _.templateSettings = _.extend(_.templateSettings, options.templateSettings);
    }

    // 递归读取目录
    _recursiveDir = function recursiveDir(curSrcPath, curDistPath, first) {

      var stats = fs.statSync(curSrcPath);
      var dirFiles;
      var i;
      var j;
      var fileContent;
      var newFilename;
      var writeErr;

      if (stats.isDirectory()) {

        // 若目标目录不存在, mkdirp 会创建一个
        mkdirp.sync(curDistPath, { mode: '0777' });

        dirFiles = fs.readdirSync(curSrcPath);

        for (i = 0; i < dirFiles.length; i++) {

          if (!inArray(dirFiles[i], options.ignore)) {
            _recursiveDir(path.resolve(curSrcPath, dirFiles[i]), path.resolve(curDistPath, dirFiles[i]));
          }
        }
      } else {

        curDistPath = curDistPath.split(path.sep);

        // 文件名转换
        newFilename = options.filenameTransformer(curDistPath.pop());
        curDistPath = path.resolve(curDistPath.join(path.sep), newFilename);

        // 文件内容变量替换
        fileContent = fs.readFileSync(curSrcPath, { encoding: options.encoding }).toString();
        fileContent = _.template(fileContent)(options.data);

        for (j = 0; j < options.sstrReplace.length; j++) {
          fileContent = fileContent.replace(new RegExp(options.sstrReplace[j].str, 'g'), options.sstrReplace[j].replacer);
        }

        writeErr = fs.writeFileSync(curDistPath, fileContent);
        if (!writeErr) {
          log.success(curDistPath + ' 写入成功');
        } else {
          log.error(curDistPath + ' 写入出错');
        }
      }
    };

    _recursiveDir(options.src, options.dist, true);
  },

  /**
   * 复制文件
   * 支持 underscore 模板引擎, 标签开始和结束符是: <{% %}>
   * @param options
   * @param options.src 绝对路径
   * @param options.dist 绝对路径
   * @param options.data
   * todo 需要支持 sstrReplace
   */
  file: function file(options) {

    var content;

    options.data = options.data || {};
    options.encoding = options.encoding || 'utf-8';

    if (!fs.existsSync(options.src)) {
      log.error(options.src + ' 文件不存在');
      return;
    }

    if (fs.statSync(options.src).isDirectory()) {
      mkdirp.sync(options.dist);
      log.success(options.dist + ' 写入成功');
      return;
    }

    // 数据模板转换
    content = fs.readFileSync(options.src, { encoding: options.encoding });
    try {
      content = _.template(content)(options.data);
    } catch (err) {
      log.error(options.src + ' template 失败请检查模板及数据是否正确');
    }

    // 若没有目录文件需要创建,最终创建文件
    mkdirp.sync(path.dirname(options.dist));
    fs.writeFileSync(options.dist, content);
    log.success(options.dist + ' 写入成功');
  },

  /**
   * 重写文件内容, 本文件不提供读写文件能力,使用者自己读写文件(主要考虑一个文件需要多次被重写)
   * 每次调用只能 match 一个hook
   * @param options
   * @param options.content
   * @param options.hook  判断需要插入行的标记
   * @param options.insertLines 数组类型, 每一项为新行
   * @param options.place   before / after(default)
   * @param options.noMatchActive   top / bottom / null(default)
   * @return string
   * todo 需要支持读写文件
   */
  rewrite: function rewrite(options) {

    var lines;
    var i;
    var matchLineIndex = -1;

    options = _.extend({
      content: '',
      hook: '',
      insertLines: [],
      place: 'after',
      noMatchActive: ''
    }, options);

    lines = options.content.split('\n');

    // 找到 match 的行号
    if (options.hook) {
      for (i = 0; i < lines.length; i++) {
        if (lines[i].indexOf(options.hook) !== -1) {
          matchLineIndex = i;
          break;
        }
      }
    }

    if (matchLineIndex === -1 && options.noMatchActive) {
      // 没有 match 处理
      matchLineIndex = options.noMatchActive === 'top' ? 0 : lines.length - 1;
    } else {
      // 前后位置处理
      options.place === 'after' && matchLineIndex++;
    }

    // 插入内容
    if (matchLineIndex !== -1) {
      lines.splice(matchLineIndex, 0, options.insertLines.join('\n'));
    }

    return lines.join('\n');
  },
  getDirectories: function getDirectories() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (!fs.existsSync(path)) {
      log.error('源文件目录不存在');
      return;
    }
    var stats = fs.statSync(path);
    if (!stats.isDirectory()) {
      log.error('源文件目录不存在');
      return;
    }
    return fs.readdirSync(path);
  },
  symlink: function symlink(src, dest) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'dir';

    return new Promise(function (resolve, reject) {
      if (process.platform !== 'win32') {
        // src = relative(path.resolve(dest, '../'), src);
        src = relative(dirname(dest), src);
        // console.log('src :', src);
      }
      fs.lstat(dest, function (err) {
        if (!err) {
          fs.unlink(dest, function () {
            return fs.symlink(src, dest, type, function (uerr) {
              if (uerr) {
                reject(uerr);
              } else {
                resolve();
              }
            });
          });
        } else {
          fs.symlink(src, dest, type, function (serr) {
            if (serr) {
              reject(serr);
            } else {
              resolve();
            }
          });
        }
      });
    });
  }

};

module.exports = TemplateCopy;

/**
 * inArray
 * @param item
 * @param arr
 * @returns {boolean}
 */
function inArray(item, arr) {

  for (var i = 0; i < arr.length; i++) {
    if (item === arr[i]) {
      return true;
    }
  }
  return false;
}