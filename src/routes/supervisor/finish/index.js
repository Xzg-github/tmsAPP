import React from 'react';

export default {
  path: '/finish',

  action() {
    return {
      wrap: true,
      component: <div>已办任务</div>
    };
  }
}
