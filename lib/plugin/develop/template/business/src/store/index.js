/**
 * Created by jack.ch on 2016/10/28.
 */

'use strict';

import { createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-api-async';
import Api from '../api';
import reducers from '../reducers';


export default (enhancer, middwares = [], preloadedState) => {
  const createStoreWithMdware = applyMiddleware(
    thunkMiddleware({
  	  Api
    }),
    ...middwares
  )(createStore);
  var store = createStoreWithMdware(reducers, preloadedState, enhancer);

  var NODE_ENV = process.env.NODE_ENV;

  if (module.hot && NODE_ENV === 'development') {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default;
      store.replaceReducer(nextReducer);
    });
  }
  return store;
};
