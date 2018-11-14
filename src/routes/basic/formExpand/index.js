import React from 'react';
import Container from './Container'

export default {
  path: '/formExpand',
  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
