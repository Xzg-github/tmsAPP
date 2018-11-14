import React from 'react';
import ReactDOM from 'react-dom';
import ConfirmDialog from '../components/ConfirmDialog';

const showConfirmDialog = (content, okFunc=undefined) => {
  let myElement = document.getElementById('globalContainer');
  if (!myElement) {
    myElement = document.createElement("div");
    myElement.id = 'globalContainer';
    document.body.appendChild(myElement);
  }
  const onCancel = () => {
    ReactDOM.unmountComponentAtNode(myElement);
  };
  const onOk = async () => {
    ReactDOM.unmountComponentAtNode(myElement);
    okFunc && okFunc();
  };
  const props = {
    title: '提示',
    ok: '确定',
    cancel: '取消',
    content,
    onOk,
    onCancel
  };
  ReactDOM.render(<ConfirmDialog {...props} />, myElement);
};

export {showConfirmDialog};
