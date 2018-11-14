import React from 'react';
import AccountManagerContainer from './AccountManagerContainer';

export default {
  path: '/accountManager',
  action() {
    return {
      wrap: true,
      component: <AccountManagerContainer/>,
    };
  }
}
