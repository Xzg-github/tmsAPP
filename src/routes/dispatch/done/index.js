import React from 'react';
import Container from './DoneContainer';

export default {
  path: '/done',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
