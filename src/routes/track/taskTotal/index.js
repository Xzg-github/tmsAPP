import React from 'react';
import Container from './TaskTotalContainer';

export default {
  path: '/task_total',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
