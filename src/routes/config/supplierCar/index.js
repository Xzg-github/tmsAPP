import React from 'react';

export default {
  path: '/supplier_car',

  action() {
    return {
      wrap: true,
      component: <div>车辆档案</div>
    };
  }
}
