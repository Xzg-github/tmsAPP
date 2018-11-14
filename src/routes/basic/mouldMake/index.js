import React from 'react';
import MouldMakeContainer from './MouldMakeContainer';

const path = '/mouldMake';

const action = () => {
  return {
    wrap: true,
    component: <MouldMakeContainer />
  }
};

export default {path, action};
