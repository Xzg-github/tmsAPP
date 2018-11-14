import React from 'react';
import AreaContainer from './AreaContainer';

export default {
  path: '/area',

  action() {
    return {
      wrap: true,
      component: <AreaContainer />
    };
  }
}

