import React from 'react';
import Container from './Container';

export default {
  path: '/rate',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}

