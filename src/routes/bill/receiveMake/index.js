import React from 'react';

export default {
  path: '/receive_make',

  action() {
    return {
      wrap: true,
      component: <div>应收费用制作</div>
    };
  }
}
