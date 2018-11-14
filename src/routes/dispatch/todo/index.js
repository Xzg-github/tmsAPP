import React from 'react';

export default {
  path: '/todo',

  action() {
    return {
      wrap: true,
      component: <div>待办任务</div>
    };
  }
}
