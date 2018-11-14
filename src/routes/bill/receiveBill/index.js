import React from 'react';

export default {
  path: '/receive_bill',

  action() {
    return {
      wrap: true,
      component: <div>应收票结帐单</div>
    };
  }
}
