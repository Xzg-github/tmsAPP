import React from 'react';

export default {
  path: '/supplier_price',

  action() {
    return {
      wrap: true,
      component: <div>供应商价格</div>
    };
  }
}
