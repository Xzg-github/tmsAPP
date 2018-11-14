import React from 'react';
import ServiceManagerContainer from './ServiceManagerContainer';

const path = '/serviceManager';

const action = () => {
  return {
    wrap: true,
    component: <ServiceManagerContainer />
  }
};

export default {path, action};
