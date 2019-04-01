import React from 'react';
import Container from './OrderPageContainer';

export default {
  path: '/information',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
