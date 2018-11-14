import React from 'react';
import DataRuleContainer from './DataRuleContainer';

const path = '/jurisdiction_dataRule';

const action = () => {
  return {
    wrap: true,
    component: <DataRuleContainer />
  }
};

export default {path, action};
