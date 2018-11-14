import React from 'react';

export default {
  path: '/inside_car',

  action() {
    return {
      wrap: true,
      component: <div>自有车档案</div>
    };
  }
}
