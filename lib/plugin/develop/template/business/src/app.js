'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import getStore from './store';
import Dashboard from './containers/dashboard';
import Tool from './util';
import getInitProp from './util/apiMap';
import './index.scss';
const merge = Object.assign;
export default (props) => {
  const {apiProp = {}, componentProp = {}} = props;
  const {fetchProp, mtopProp} = apiProp;
  Tool.init(merge({}, getInitProp(), mtopProp));
  const {domProps = {}, enhancer, middlewares, preloadedState} = componentProp;
  const store = getStore(enhancer, middlewares, preloadedState);
  return (<Provider store={store}>
    <Dashboard domProps={domProps}/>
  </Provider>);
};
