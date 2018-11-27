import React from 'react';
import RootContainer from './RootContainer';

const path = '/customer_factory';

const action = () => {
  return {
    wrap: true,
    component: <RootContainer />
  }
};

export default {path, action};
