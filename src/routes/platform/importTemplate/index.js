import React from 'react';
import ImportTemplateContainer from './ImportTemplateContainer';

const path = '/importTemplate';

const action = () => {
  return {
    wrap: true,
    component: <ImportTemplateContainer />
  }
};

export default {path, action};
