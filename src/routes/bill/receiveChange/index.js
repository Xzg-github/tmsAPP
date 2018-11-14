import React from 'react';

export default {
  path: '/receive_change',

  action() {
    return {
      wrap: true,
      component: <div>应收改单</div>
    };
  }
}
