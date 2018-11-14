import React from 'react';
import ExcelOutputConfigurationContainer from './excelOutputConfigurationContainer'

export default {
  path: '/excelOutputConfiguration',
  action() {
    return {
      wrap: true,
      component: <ExcelOutputConfigurationContainer />
    };
  }
}
