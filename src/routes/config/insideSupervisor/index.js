import React from 'react';
import Container from './Container'

export default {
  path: '/insideSupervisor',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
