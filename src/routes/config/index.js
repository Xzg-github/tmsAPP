import RouterHelper from '../RouteHelper';

const title = '档案管理';
const prefix = '/config';
const children = [
  require('./rate').default,
  require('./chargeItem').default,
  require('./institution').default,
  require('./department').default,
  require('./user').default,
  require('./customersArchives').default,
  require('./suppliersArchives').default,
];

export default RouterHelper(prefix, title, children);
