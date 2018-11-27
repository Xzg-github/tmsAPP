import React from 'react';
import Container from './CustomerCostContainer';

export default {
  path: '/customer_cost',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
