import React from 'react';
import DepartmentContainer from './DepartmentContainer';

const path = '/department';

const action = () => {
  return {
    wrap: true,
    component: <DepartmentContainer />
  }
};

export default {path, action};
