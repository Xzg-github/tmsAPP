import React from 'react';
import TenantCurrencyContainer from './TenantCurrencyContainer'

export default {
  path: '/tenantCurrency',

  action() {
    return {
      wrap: true,
      component: <TenantCurrencyContainer />
    };
  }
}
