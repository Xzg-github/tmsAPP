import React from 'react';
import DataSetContainer from './DataSetContainer';

export default {
  path: '/dataset',
  action() {
    return {
      wrap: true,
      component: <DataSetContainer/>
    };
  }
}
