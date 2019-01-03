import React from 'react';
import Container from './ImportContainer';

export default {
  path: '/import',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
