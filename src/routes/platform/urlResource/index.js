import React from 'react';
import UrlResourceContainer from './UrlResourceContainer'

const path = '/urlResource';

const action = () => {
  return {
    wrap: true,
    component: <UrlResourceContainer />
  }
};

export default {path, action};
