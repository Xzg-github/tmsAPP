import React from 'react';
import Container from './RootContainer';

export default {
  path: '/supplier_price',

  action() {
    return {
      wrap: true,
      component: <Container/>
    };
  }
}
