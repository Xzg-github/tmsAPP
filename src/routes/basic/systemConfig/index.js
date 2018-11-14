import React from 'react';
import SystemConfigContainer from './SystemConfigContainer'

const path = '/systemConfig';

const action = () => {
  return {
    wrap: true,
    component: <SystemConfigContainer/>
  }
};

export default {path, action};
