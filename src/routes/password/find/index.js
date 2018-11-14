import React from 'react';
import Page from './Page';

export default {
  path: '/password/find',
  action() {
    return {
      single: true,
      title: '找回密码',
      component: <Page />
    };
  }
};
