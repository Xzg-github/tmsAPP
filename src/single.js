import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import queryString from 'query-string';
import App from './components/App';
import Login from './routes/login/Login';
import Find from './routes/password/find/Page';
import Reset from './routes/password/reset/Page';

const context = {
  insertCss: (...styles) => {
    const removeCss = styles.map(x => x._insertCss());
    return () => { removeCss.forEach(f => f()); };
  },
};

const getCurrent = () => {
  const path = window.location.pathname.replace(/\/$/g, '');
  if (path === '/login') {
    return <Login />;
  } else if (path === '/password/find') {
    return <Find />;
  } else if (path === '/password/reset') {
    const query = queryString.parse(window.location.search);
    return <Reset sid={query.sid} email={query.userAccount} />;
  } else {
    return <div>页面不存在</div>;
  }
};

const container = document.getElementById('app');
const component = <App context={context}>{getCurrent()}</App>;
ReactDOM.render(component, container);
