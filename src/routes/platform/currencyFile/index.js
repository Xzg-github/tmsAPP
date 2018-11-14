import React from 'react';
import CurrencyFileContainer from './CurrencyFileContainer'

export default {
  path: '/currencyFile',
  action() {
    return {
      wrap: true,
      component: <CurrencyFileContainer />
    };
  }
}
