import React from 'react';
import Container from './CustomerServiceContainer';

export default {
  path: '/customer_service',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
