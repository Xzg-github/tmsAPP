import React from 'react';

export default {
  path: '/receive_monthly_bill',

  action() {
    return {
      wrap: true,
      component: <div>应收月结帐单</div>
    };
  }
}
