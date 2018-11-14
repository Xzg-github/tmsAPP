import React from 'react';
import LayoutContainer from '../../components/Layout/LayoutContainer';

const title = '工作台';

export default {
  path: '/',

  async action() {
    return {
      title,
      component: <LayoutContainer nav1='home'>待开发</LayoutContainer>
    };
  }
};
