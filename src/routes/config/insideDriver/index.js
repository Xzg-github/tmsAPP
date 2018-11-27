import React from 'react';
import Container from './Container';

const path = '/insideDriver';

const action = () => {
  return {
    wrap: true,
    component: <Container />
  }
};

export default {path, action};
