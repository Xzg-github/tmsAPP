import React from 'react';
import RootContainer from './RootContainer';

export default {
  path: '/receive_make',

  action() {
    return {
      wrap: true,
      component: <RootContainer home/>
    };
  }
}
