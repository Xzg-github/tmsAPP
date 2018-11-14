import React from 'react';
import CommonOutputContainer  from './commonOutputContainer'

export default {
  path: '/commonOutput',

  action() {
    return {
      wrap: true,
      component: <CommonOutputContainer/>
    };
  }
}
