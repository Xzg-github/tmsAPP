import React from 'react';

export default {
  path: '/customer_cost',

  action() {
    return {
      wrap: true,
      component: <div>习惯费用项</div>
    };
  }
}
