import React from 'react';
import MessageSubscribeContainer from './MessageSubscribeContainer';

export default {
  path: "/messageSubscribe",

  action(){
    return {
      wrap: true,
      component: <MessageSubscribeContainer />
    }
  }
}
