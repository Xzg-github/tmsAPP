import React from 'react';

export default {
  path: '/import',

  action() {
    return {
      wrap: true,
      component: <div>运单导入</div>
    };
  }
}
