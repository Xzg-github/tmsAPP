import React from 'react';

export default {
  path: '/customer_tax',

  action() {
    return {
      wrap: true,
      component: <div>税率档案</div>
    };
  }
}
