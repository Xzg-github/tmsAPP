import React from 'react';
import Container from './OrderPageContainer';

export default {
  path: '/customer_task',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
