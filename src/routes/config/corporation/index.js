import React from 'react';
import Container from './OrderPageContainer';

export default {
  path: '/corporation',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
