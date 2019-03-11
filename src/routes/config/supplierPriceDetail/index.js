import React from 'react';
import Container from './RootContainer';

export default {
  path: '/supplier_price_detail',

  action() {
    return {
      wrap: true,
      component: <Container/>
    };
  }
}
