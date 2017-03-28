'use strict';



import RockCore from '@ali/rock-core';
import FuwuSwc from '../src/app';


RockCore.render(FuwuSwc, {
  apiProp: {
    mtopProp: {
      mockJS: process.env.NODE_ENV === 'development' ? require('mockjs') : null
    }
    // mtopProp: {
    //   reqParam:{
    //     dataType:'jsonp'
    //   },
    //   reqConfig: {
    //     prefix: 'rock',
    //     subDomain: 'api',
    //     mainDomain: 'com:8088/data/fw-recommend/src'
    //     // subDomain:'waptest'
    //   }
    //   // mockJS: process.env.NODE_ENV === 'development' ? require('mockjs') : null
    // }
    // apiMap: {
    //   'getData': ['/getData', {
    //     success: '@boolean',
    //     errMsg: '@string()',
    //     data: {
    //         // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    //       'swc|1-10': [{
    //             // 属性 id 是一个自增数，起始值为 1，每次增 1
    //         'name|+1': 1
    //       }]
    //     }
    //   }]
    // }
  }
}, document.getElementById('container'));
