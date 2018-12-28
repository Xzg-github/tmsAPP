import React from 'react';
import RootContainer from './RootContainer'

export default {
  path: '/pay_monthly_bill',

  action() {
    return {
      wrap: true,
      component: <RootContainer/>
    };
  }
}
