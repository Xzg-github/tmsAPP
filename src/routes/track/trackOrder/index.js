import React from 'react';
import Container from './TrackOrderContainer';

export default {
  path: '/track_order',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
