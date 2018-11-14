import React from 'react';
import SMSmailContainer from './SMSmailContainer'

const path = '/SMSmail';

const action = () => {
  return {
    wrap: true,
    component: <SMSmailContainer/>
  }
};

export default {path, action};
