import React from 'react';

export default {
  path: '/customer_factory',

  action() {
    return {
      wrap: true,
      component: <div>收发货档案</div>
    };
  }
}
