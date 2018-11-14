import React from 'react';
import RoleDataAuthorityContainer from './RoleDataAuthorityContainer';

const path = '/role_data_authority';

const action = () => {
  return {
    wrap: true,
    component: <RoleDataAuthorityContainer />
  }
};

export default {path, action};
