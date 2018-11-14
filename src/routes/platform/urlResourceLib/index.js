import React from 'react';
import UrlResourceLibContainer from './UrlResourceLibContainer'

export default {
  path: '/urlResourceLib',

  action() {
    return {
      wrap: true,
      component: <UrlResourceLibContainer/>
    };
  }
}
