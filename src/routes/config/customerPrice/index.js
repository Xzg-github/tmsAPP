import React from 'react';
import Container from './RootContainer';

export default {
  path: '/customer_price',

  action() {
    return {
      wrap: true,
      component: <Container/>
    };
  }
}
