import React from 'react';
import CarTypeContainer from './CarTypeContainer'

export default {
  path: '/car_type',
  action() {
    return {
      wrap: true,
      component: <CarTypeContainer />
    };
  }
}

