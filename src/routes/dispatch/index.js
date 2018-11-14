import RouterHelper from '../RouteHelper';
import React from 'react';

const title = '车辆调度';
const prefix = '/dispatch';

const children = [
  require('./todo').default,
  require('./done').default,
  require('./carManager').default,
];

export default RouterHelper(prefix, title, children);
