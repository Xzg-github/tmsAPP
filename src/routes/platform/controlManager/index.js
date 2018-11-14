import React from 'react';
import ControlManagerContainer from './ControlManagerContainer';

const path = '/controlManager';

const action = () => {
  return {
    wrap: true,
    component: <ControlManagerContainer />
  }
};

export default {path, action};
