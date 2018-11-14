import React from 'react';
import TenantAuthorityDistributionContainer from './TenantAuthorityDistributionContainer';

export default {
  path: '/tenantAuthorityDistribution',
  action() {
    return {
      wrap: true,
      component: <TenantAuthorityDistributionContainer/>,
    };
  }
}
