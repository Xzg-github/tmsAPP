import React from 'react';
import TenantRuleTypesContainer from './TenantRuleTypesContainer';

const path = '/jurisdiction_tenant_rule_types';

const action = () => {
  return {
    wrap: true,
    component: <TenantRuleTypesContainer />
  }
};

export default {path, action};
