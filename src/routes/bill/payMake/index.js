import React from 'react';
import RootContainer from './RootContainer';

export default {
  path: '/pay_make',

  action() {
    return {
      wrap: true,
      component: <RootContainer/>
    };
  }
}
