import orderConfig from './orderConfig';
import dispatchConfig from './dispatchConfig';
import trackConfig from './trackConfig';
import abnormalConfig from './abnormalConfig';
import systemConfig from './systemConfig';
import sendInfoConfig from './sendInfoConfig';

const KEYS = ['msg_order','msg_dispatch','msg_track','msg_abnormal','msg_system'];
const MESSAGE_TYPES = [
  {value:0,title:'系统消息'},
  {value:1,title:'订单消息'},
  {value:2,title:'派单消息'},
  {value:3,title:'跟踪消息'},
  {value:4,title:'异常消息'}
];

const config = {
  msg_order: orderConfig,
  msg_dispatch: dispatchConfig,
  msg_track: trackConfig,
  msg_abnormal: abnormalConfig,
  msg_system: systemConfig,
  names:[],
  KEYS
};

export default config;
export {KEYS,sendInfoConfig,MESSAGE_TYPES};
