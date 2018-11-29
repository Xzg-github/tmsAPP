import React from 'react';
import Container from './Container'

export default {
  path: '/supplierSupervisor',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
