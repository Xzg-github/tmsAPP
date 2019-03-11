import React from 'react';
import Container from './AcceptContainer';

export default {
  path: '/accept',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
