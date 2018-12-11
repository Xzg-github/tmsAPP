import React from 'react';
import FindPassword from './FindPassword';

export default {
  path: '/password/find',
  action() {
    return {
      single: true,
      title: '找回密码',
      component: <FindPassword />
    };
  }
};
