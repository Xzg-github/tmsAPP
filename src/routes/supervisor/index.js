import RouterHelper from '../RouteHelper';
import React from 'react';

const title = '监理任务';
const prefix = '/supervisor';

const children = [
  require('./waiting').default,
  require('./finish').default,
  require('./supervisorManager').default,
];

export default RouterHelper(prefix, title, children);
