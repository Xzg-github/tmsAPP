import React from 'react';

export default {
  path: '/supplier_driver',

  action() {
    return {
      wrap: true,
      component: <div>司机档案</div>
    };
  }
}
