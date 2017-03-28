import {NameSpace} from '@ali/rock-util';
import {Fetch} from '../util';
const ns = NameSpace('PAY_API');
const merge = Object.assign;
export const LOAD_DATA = ns('LOAD_DATA');
export default {
  [LOAD_DATA]: (getState, param) => {
    return Fetch({
      name: 'getData',
      param: {
        data: {
          swc: 3
        }
      }
    });
  }
};
