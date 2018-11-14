/**
 * Created by vincentzheng on 2017/8/2.
 */
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
