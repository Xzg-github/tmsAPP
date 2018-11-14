import React from 'react';

export default {
  path: '/pay_change',

  action() {
    return {
      wrap: true,
      component: <div>应付改单</div>
    };
  }
}
