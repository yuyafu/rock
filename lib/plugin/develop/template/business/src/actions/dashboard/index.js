'use strict';

import {NameSpace} from '@ali/rock-util';
let ns = NameSpace('dashboard');
import {createAction, sync} from 'redux-api-async';
import {LOAD_DATA} from '../../api';


export function loadData() {
  return sync(function* () {
    let result = yield createAction({
      type: LOAD_DATA
    });
    console.log('result :', result);
  });
}
