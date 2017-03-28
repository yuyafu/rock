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
  argument: '<type>',
  description: '添加组件',
  alias: 'a',
  options: [{ name: '-e,--edition', desc: '业务组件版本' }]
}, {
  name: 'build',
  description: '编译和打包组件',
  options: [{ name: '-c, --compress', desc: '压缩代码' }, { name: '-b, --bundle', desc: '启用webpack-bundle-analyzer插件' }, { name: '-p, --package <packages>', desc: '要编译的组件,形如a,b,c' }, { name: '-d, --build <build>', desc: '编译后的代码输出目录' }],
  alias: 'b'
}, {
  name: 'start',
  description: '启动本地服务器，开发组件',
  options: [{ name: '-t, --port <port>', desc: '指定端口' }, { name: '-p, --package <packages>', desc: '要启动开发的页面,形如a,b,c' }, { name: '-d, --page <page>', desc: '浏览器默认打开的页面' }],
  alias: 's'
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