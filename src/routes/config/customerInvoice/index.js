import React from 'react';
import Container from './OrderPageContainer';

export default {
  path: '/customer_invoice',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
