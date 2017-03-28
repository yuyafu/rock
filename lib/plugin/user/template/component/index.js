'use strict';



import RockCore from '@ali/rock-core';
import Component from '@ali/<{%=componentName%}>';
// import '@ali/fw-recommend/styles/<{%=libName%}>.next.css';
// import '@ali/fw-recommend/styles/<{%=libName%}>.css';
import Config from './config';

RockCore.render(Component, Config.props, document.getElementById(Config.id));
