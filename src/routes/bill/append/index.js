import React from 'react';
import Container from './AppendContainer';

export default {
  path: '/append',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
