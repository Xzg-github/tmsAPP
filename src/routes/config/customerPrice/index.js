import React from 'react';

export default {
  path: '/customer_price',

  action() {
    return {
      wrap: true,
      component: <div>客户价格</div>
    };
  }
}
