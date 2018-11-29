import React from 'react';
import Container from './SupplierCostContainer';

export default {
  path: '/supplier_cost',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
