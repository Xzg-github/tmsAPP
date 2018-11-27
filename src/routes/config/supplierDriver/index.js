import React from 'react';
import Container from './Container';

const path = '/supplierDriver';

const action = () => {
  return {
    wrap: true,
    component: <Container />
  }
};

export default {path, action};
