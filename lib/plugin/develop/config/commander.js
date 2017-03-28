'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var version = exports.version = '0.0.5';
exports.default = [{
  name: 'init',
  description: '初始化项目模板',
  alias: 'i'
}, {
  name: 'add',
  description: '添加组件',
  alias: 'a'
}, {
  name: 'build',
  description: '编译和打包组件',
  options: [{ name: '-c, --compress', desc: '压缩代码' }, { name: '-b, --bundle', desc: '启用webpack-bundle-analyzer插件' }, { name: '-p, --package <packages>', desc: '要编译的组件,形如a,b,c' }],
  alias: 'b'
}, {
  name: 'start',
  description: '启动本地服务器，开发组件',
  options: [{ name: '-t, --port <port>', desc: '指定端口' }, { name: '-p, --package <packages>', desc: '要启动开发的组件,形如a,b,c' }, { name: '-d, --page <page>', desc: '浏览器默认打开的页面' }],
  alias: 's'
}, {
  name: 'lerna',
  argument: '<cmd> [task]',
  description: '运行lerna命令',
  options: [{ name: '-s, --scope <glob>', desc: '指定子包,正则表达式' }, { name: '-i, --ignore <glob>', desc: '排除一些package' }],
  alias: 'l'
}, {
  name: 'git',
  argument: '<cmd> [type]',
  options: [{ name: '-m, --comment <glob>', desc: '提交注释' }, { name: '-b, --branch  <glob>', desc: '要创建的分支' }, { name: '-v, --vtype <glob>', desc: '如何增加版本号' }],
  description: '封转git操作,提供创建git仓库,提交日常,发布线上的功能',
  alias: 'g'
}, {
  name: 'update',
  description: '更新模板',
  alias: 'u'
}
// , {
//   name: 'test',
//   description: '更新模板',
//   alias: 'u',
// }
];