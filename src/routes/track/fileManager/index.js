import React from 'react';
import Container from './FileManagerContainer';

export default {
  path: '/file_manager',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
