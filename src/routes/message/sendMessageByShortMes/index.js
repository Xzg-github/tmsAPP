import React from 'react';
import SendMessageByShortMesContainer from './sendMessageByShortMesContainer';


export default {
  path: "/sendMessageByShortMes",

  action(){
    return {
      wrap: true,
      component: < SendMessageByShortMesContainer />
    }
  }
}
