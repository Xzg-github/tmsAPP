import React from 'react';
import PublicAuthorityContainer from './PublicAuthorityContainer';

export default {
  path: '/publicAuthority',
  action() {
    return {
      wrap: true,
      component: <PublicAuthorityContainer/>,
    };
  }
}
