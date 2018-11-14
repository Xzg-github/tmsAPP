import React from 'react';

export default {
  path: '/supervisor_manager',

  action() {
    return {
      wrap: true,
      component: <div>监理管理</div>
    };
  }
}
