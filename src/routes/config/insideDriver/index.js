import React from 'react';

export default {
  path: '/inside_driver',

  action() {
    return {
      wrap: true,
      component: <div>自有司机档案</div>
    };
  }
}
