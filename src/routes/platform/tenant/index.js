import React from 'react';
import TenantContainer from './TenantContainer';

const path = '/tenant';

const action = () => {
  return {
    wrap: true,
    component: <TenantContainer />
  }
};

export default {path, action};
