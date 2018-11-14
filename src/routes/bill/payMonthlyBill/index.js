import React from 'react';

export default {
  path: '/pay_monthly_bill',

  action() {
    return {
      wrap: true,
      component: <div>应付月结帐单</div>
    };
  }
}
