import React from 'react';
import ExcelConfigLibContainer from './ExcelConfigLibContainer';

export default {
  path: '/excelConfigLib',
  action() {
    return {
      wrap: true,
      component: <ExcelConfigLibContainer />,
    };
  }
}
