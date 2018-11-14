import React from 'react';
import DefaultOutputContainer from './DefaultOutputContainer'

export default {
  path: '/defaultOutput',
  action() {
    return {
      wrap: true,
      component: <DefaultOutputContainer/>
    };
  }
}
