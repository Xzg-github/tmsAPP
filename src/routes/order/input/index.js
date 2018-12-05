import React from 'react';
import Container from './InputContainer';

export default {
  path: '/input',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
