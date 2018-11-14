import React from 'react';

export default {
  path: '/supplier_supervisor',

  action() {
    return {
      wrap: true,
      component: <div>监理档案</div>
    };
  }
}
