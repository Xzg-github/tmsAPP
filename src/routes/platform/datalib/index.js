import React from 'react';
import DatalibContainer from './DatalibContainer';

export default {
  path: '/datalib',
  action() {
    return {
      wrap: true,
      component: <DatalibContainer/>
    };
  }
}
