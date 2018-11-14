import React from 'react';

export default {
  path: '/inside_supervisor',

  action() {
    return {
      wrap: true,
      component: <div>自有监理档案</div>
    };
  }
}
