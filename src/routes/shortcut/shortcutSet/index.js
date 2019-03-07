import React from 'react';
import Container from './ShortcutSetContainer';

export default {
  path: '/shortcut_set',

  action() {
    return {
      wrap: true,
      component: <Container />
    };
  }
}
