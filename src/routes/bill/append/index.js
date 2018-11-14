import React from 'react';

export default {
  path: '/append',

  action() {
    return {
      wrap: true,
      component: <div>运单补录</div>
    };
  }
}
