import React from 'react';
import Container from './TrackTransportContainer';

export default {
  path: '/track_transport',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
