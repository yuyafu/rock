


import {RockMtop} from '@ali/rock-util';
import {Feedback} from '@alife/next';
const Toast = Feedback.toast;
const tool = new RockMtop({
  Toast,
  reqParam: {
    v: '1.0'
  }
});
const Fetch = tool.ajax;
export default tool;
export {
  Fetch
};
