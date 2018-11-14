import React from 'react';

export default {
  path: '/waiting',

  action() {
    return {
      wrap: true,
      component: <div>待办任务</div>
    };
  }
}
