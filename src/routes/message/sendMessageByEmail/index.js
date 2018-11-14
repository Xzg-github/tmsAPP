import React from 'react';
import SendMessageByEmailContainer from './sendMessageByEmailContainer';


export default {
  path: "/sendMessageByEmail",

  action(){
    return {
      wrap: true,
      component: < SendMessageByEmailContainer />
    }
  }
}
