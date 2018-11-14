import React from 'react';

export default {
  path: '/supplier_contact',

  action() {
    return {
      wrap: true,
      component: <div>联系人档案</div>
    };
  }
}
