import React from 'react';
import LayoutContainer from '../../../components/Layout/LayoutContainer';
import Container from './Container';

export default {
  path: '/password/modify',
  action() {
    return {
      title: '修改密码',
      component: <LayoutContainer><Container /></LayoutContainer>
    };
  }
};
