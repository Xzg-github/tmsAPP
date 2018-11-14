import React from 'react';

export default {
  path: '/all',

  action() {
    return {
      wrap: true,
      component: <div>运输汇总</div>
    };
  }
}
