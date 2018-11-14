import React from 'react';
import InstitutionContainer from './InstitutionContainer';

const path = '/institution';

const action = () => {
  return {
    wrap: true,
    component: <InstitutionContainer />
  }
};

export default {path, action};
