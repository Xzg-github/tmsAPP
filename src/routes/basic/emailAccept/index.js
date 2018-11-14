import React from 'react';
import EmailAcceptContainer from './EmailAcceptContainer'

export default {
  path: '/emailAccept',

  action() {
    return {
      wrap: true,
      component: <EmailAcceptContainer />
    };
  }
}
