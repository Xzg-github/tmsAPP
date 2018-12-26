import React from 'react';
import RootContainer from './RootContainer';

export default {
  path: '/receive_apply',

  action() {
    return {
      wrap: true,
      component: <RootContainer/>
    };
  }
}
