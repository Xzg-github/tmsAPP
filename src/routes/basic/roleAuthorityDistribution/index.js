import React from 'react';
import RoleAuthorityDistributionContainer from './RoleAuthorityDistributionContainer';

export default {
  path: '/roleAuthorityDistribution',
  action() {
    return {
      wrap: true,
      component: <RoleAuthorityDistributionContainer/>,
    };
  }
}
