import React from 'react';
import {KEYS} from '../../../api/message/business/config';
import BusinessContainer from './BusinessContainer'

export default {
  path: '/:key',
  action({ params: { key } }) {
    return !KEYS.includes(key) ? null : {
      wrap: true,
      component: <BusinessContainer rootKey={key}/>
    };
  }
}
