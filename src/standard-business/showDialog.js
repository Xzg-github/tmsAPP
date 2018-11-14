import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';
import {Action} from '../action-reducer/action';

export default function showDialog(create, state) {
  const store = global.store;
  const STATE_PATH = ['temp'];
  const action = new Action(STATE_PATH, false);
  const node = document.createElement('div');
  store.dispatch(action.create(state));
  document.body.appendChild(node);

  const insertCss = (...styles) => {
    const removeCss = styles.map(x => x._insertCss());
    return () => { removeCss.forEach(f => f()); };
  };

  const afterEditActionCreator = () => () => {
    store.dispatch(action.assign({visible: false}));
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(node);
      node.parentNode.removeChild(node);
    }, 300);
  };

  const Container = create(STATE_PATH, afterEditActionCreator);
  ReactDOM.render(<App context={{store, insertCss}}><Container /></App>, node);
}
