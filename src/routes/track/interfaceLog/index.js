import React from 'react';
import Container from './RootContainer';

export default {
  path: '/interface_log',

  action() {
    return {
      wrap: true,
      component:  <Container />
    };
  }
}
