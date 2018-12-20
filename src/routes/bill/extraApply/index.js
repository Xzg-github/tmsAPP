import React from 'react';
import RootContainer from './RootContainer';

export default {
  path: '/extra_apply',

  action() {
    return {
      wrap: true,
      component: <RootContainer/>
    };
  }
}
