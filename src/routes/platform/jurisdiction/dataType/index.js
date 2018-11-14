import React from 'react';
import DataTypeContainer from './DataTypeContainer';

const path = '/jurisdiction_dataType';

const action = () => {
  return {
    wrap: true,
    component: <DataTypeContainer />
  }
};

export default {path, action};
