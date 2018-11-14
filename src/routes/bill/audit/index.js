import React from 'react';

export default {
  path: '/audit',

  action() {
    return {
      wrap: true,
      component: <div>费用整审</div>
    };
  }
}
