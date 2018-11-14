import React from 'react';

export default {
  path: '/pending',

  action() {
    return {
      wrap: true,
      component: <div>待办任务</div>
    };
  }
}
