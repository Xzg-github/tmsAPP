import React from 'react';
import UserContainer from './UserContainer';

const path = '/user';

const action = () => {
  return {
    wrap: true,
    component: <UserContainer />
  }
};

export default {path, action};
