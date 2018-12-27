import React from 'react';
import Container from './OrderPageContainer';

export default {
  path: '/bank',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
