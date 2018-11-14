import React from 'react';
import Container from './Container'

export default {
  path: '/charge_item',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}

