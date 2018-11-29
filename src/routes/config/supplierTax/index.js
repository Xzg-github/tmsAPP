import React from 'react';
import RootContainer from './RootContainer';

const path = '/supplier_tax';

const action = () => {
  return {
    wrap: true,
    component: <RootContainer />
  }
};

export default {path, action};
