import React from 'react';
import RootContainer from './RootContainer'


export default {
  path: '/inside_car',

  action() {
    return {
      wrap: true,
      component: <RootContainer/>
    };
  }
}
