import React from 'react';
import SysDictionaryContainer from './SysDictionaryContainer';

const path = '/sysDictionary';

const action = () => {
  return {
    wrap: true,
    component: <SysDictionaryContainer />
  }
};

export default {path, action};
