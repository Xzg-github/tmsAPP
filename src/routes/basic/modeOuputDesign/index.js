import React from 'react';
import ModeOutputDesignContainer from './ModeOutputDesignContainer';

export default {
  path: '/mode_output_design',
  action() {
    return {
      wrap: true,
      component: <ModeOutputDesignContainer/>
    };
  }
}
