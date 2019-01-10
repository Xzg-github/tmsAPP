import React from 'react';
import Container from './TodoContainer';

export default {
  path: '/todo',

  action() {
    return {
      wrap: true,
      component: <Container home/>
    };
  }
}
