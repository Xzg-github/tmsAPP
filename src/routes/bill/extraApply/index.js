import React from 'react';

export default {
  path: '/extra_apply',

  action() {
    return {
      wrap: true,
      component: <div>额外费用申请</div>
    };
  }
}
