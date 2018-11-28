import RouterHelper from '../RouteHelper';

const title = '档案管理';
const prefix = '/config';
const children = [
  require('./institution').default,
  require('./department').default,
  require('./user').default,

  require('./customersArchives').default,
  require('./customerContact').default,
  require('./customerFactory').default,
  require('./customerTax').default,
  require('./customerCost').default,
  require('./customerService').default,

  require('./suppliersArchives').default,
  require('./supplierContact').default,
  require('./supplierCar').default,
  require('./supplierDriver').default,
  require('./supplierSupervisor').default,
  require('./supplierCost').default,
  require('./supplierTax').default,

  require('./insideFactory').default,
  require('./insideCar').default,
  require('./insideDriver').default,
  require('./insideSupervisor').default,
  require('./rate').default,
  require('./chargeItem').default,

  require('./customerPrice').default,
  require('./supplierPrice').default,
];

export default RouterHelper(prefix, title, children);
