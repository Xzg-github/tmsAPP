import RouterHelper from '../RouteHelper';
import React from 'react';

const title = '计费与对帐';
const prefix = '/bill';

const children = [
  require('./receiveSettlement').default,
  require('./receiveMake').default,
  require('./receiveChange').default,
  require('./receiveBill').default,
  require('./receiveMonthlyBill').default,
  require('./receiveApply').default,
  require('./payMake').default,
  require('./payChange').default,
  require('./payBill').default,
  require('./payMonthlyBill').default,
  require('./audit').default,
  require('./extraApply').default,
  require('./append').default,
];

export default RouterHelper(prefix, title, children);
