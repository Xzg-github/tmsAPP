import React from 'react';
import FromOddDefineContainer from './FromOddDefineContainer'

export default {
  path: '/fromOddDefine',
  action() {
    return {
      wrap: true,
      component: <FromOddDefineContainer />
    };
  }
}
