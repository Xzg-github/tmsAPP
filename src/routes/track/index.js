import RouterHelper from '../RouteHelper';
import React from 'react';

const title = '跟踪管控';
const prefix = '/track';

const children = [
  require('./trackTransport').default,
  require('./fileManager').default,
  require('./taskTotal').default,
  require('./interfaceLog').default,
];

export default RouterHelper(prefix, title, children);
