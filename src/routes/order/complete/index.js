import React from 'react';
import Container from './CompleteContainer';

export default {
  path: '/complete',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
