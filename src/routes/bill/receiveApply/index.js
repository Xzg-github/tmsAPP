import React from 'react';

export default {
  path: '/receive_apply',

  action() {
    return {
      wrap: true,
      component: <div>应收发票申请</div>
    };
  }
}
