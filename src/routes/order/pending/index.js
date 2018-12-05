import React from 'react';
import Container from './PendingContainer';

export default {
  path: '/pending',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
