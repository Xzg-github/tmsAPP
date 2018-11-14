import React from 'react';
import RootContainer from './RootContainer'


export default {
  path: "/messageTheme",

  action(){
    return {
      wrap: true,
      component: <RootContainer/>
    }
  }
}
