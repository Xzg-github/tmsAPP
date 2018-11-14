import React from 'react';
import RootContainer from './RootContainer'

export default {
  path: '/messageSetting',

  action() {
    return {
      wrap: true,
      component: <RootContainer/>
    };
  }
}

