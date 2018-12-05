import React from 'react';
import Container from './AllContainer';

export default {
  path: '/all',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
