import React from 'react';
import Container from './PositionContainer';

export default {
  path: '/position',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
