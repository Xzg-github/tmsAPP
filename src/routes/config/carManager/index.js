import React from 'react';
import Container from './CarManagerContainer';

export default {
  path: '/car_manager',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
