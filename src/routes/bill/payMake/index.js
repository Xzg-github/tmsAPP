import React from 'react';

export default {
  path: '/pay_make',

  action() {
    return {
      wrap: true,
      component: <div>应付费用制作</div>
    };
  }
}
