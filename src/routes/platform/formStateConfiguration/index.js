import React from 'react';
import FormStateConfigurationContainer from './formStateConfigurationContainer'

export default {
  path : '/formStateConfiguration',
  action() {
    return {
      wrap: true,
      component: <FormStateConfigurationContainer/>
    };
  }
}
