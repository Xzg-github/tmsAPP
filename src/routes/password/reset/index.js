import React from 'react';
import Page from './Page';

export default {
  path: '/password/reset',
  action({query}) {
    if (!query.sid || !query.userAccount) {
      return null;
    } else {
      return {
        single: true,
        title: '重置密码',
        component: <Page sid={query.sid} email={query.userAccount} />
      };
    }
  }
};
