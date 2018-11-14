import React from 'react';
import RouterHelper from '../RouteHelper';

const title = '平台管理';
const prefix = '/platform';

const children = [
  require('./publicAuthority').default,
  require('./dataset').default,
  require('./datalib').default,
  require('./excelOutputConfiguration').default,
  require('./importTemplate').default,
  require('./messageTheme').default,
  require('./formStateConfiguration').default,

  require('./tenantAuthorityDistribution').default,
  require('./jurisdiction/tenantRuleTypes').default,
  require('./tenantapi').default,

  require('./sysDictionary').default,
  require('./carType').default,
  require('./currencyFile').default,
  require('./area').default,

  require('./jurisdiction/dataRule').default,
  require('./jurisdiction/dataType').default,

  require('./serviceManager').default,
  require('./controlManager').default,
  require('./urlResourceLib').default,
  require('./urlResource').default,
  require('./tenant').default,
];

export default RouterHelper(prefix, title, children);
