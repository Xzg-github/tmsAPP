import React from 'react';

export default {
  path: '/pay_bill',

  action() {
    return {
      wrap: true,
      component: <div>应付票结帐单</div>
    };
  }
}
