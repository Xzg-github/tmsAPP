import React from 'react';

export default {
  path: '/car_manager',

  action() {
    return {
      wrap: true,
      component: <div>车辆管理</div>
    };
  }
}
