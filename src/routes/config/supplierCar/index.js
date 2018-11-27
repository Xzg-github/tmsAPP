import React from 'react';
import RootContainer from './RootContainer'


export default {
  path: '/supplier_car',

  action() {
    return {
      wrap: true,
      component: <RootContainer/>
    };
  }
}
