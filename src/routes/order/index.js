import RouterHelper from '../RouteHelper';
import React from 'react';

const title = '运输订单';
const prefix = '/order';

const children = [
  require('./input').default,
  require('./import').default,
  require('./accept').default,
  require('./pending').default,
  require('./complete').default,
  require('./all').default,
];

export default RouterHelper(prefix, title, children);
