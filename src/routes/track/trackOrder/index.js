import React from 'react';

export default {
  path: '/track_order',

  action() {
    return {
      wrap: true,
      component: <div>运单跟踪</div>
    };
  }
}
