import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const getStore = (initState) => {
  return createStore(rootReducer, initState, applyMiddleware(thunk));
};

export default getStore;
