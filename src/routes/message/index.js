import RouterHelper from '../RouteHelper';

const title = '消息';
const prefix = '/message';

let children = [
  require('./business').default,
  require('./sendMessageByShortMes').default,
  require('./sendMessageByEmail').default,
  require('./messageSubscribe').default
];

export default RouterHelper(prefix, title, children);

