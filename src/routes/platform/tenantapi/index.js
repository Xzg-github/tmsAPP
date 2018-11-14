import React from 'react';
import TenantapiContainer from './TenantapiContainer'

export default {
  path: '/tenantapi',

  action() {
    return {
      wrap: true,
      component: <TenantapiContainer />
    };
  }
}
