import React from 'react';
import ReactDOM from 'react-dom';
import {Upload} from 'antd';

const UploadComponent = ({url, onChange, beforeUpload}) => {
  const props = {
    onChange, beforeUpload,
    action: url,
    showUploadList: false,
    withCredentials: true
  };
  return (
    <Upload {...props}>
      <button ref={e => e && e.click()} />
    </Upload>
  );
};

let lastResolve = null;

const upload = (url) => {
  return new Promise(resolve => {
    let node = document.getElementById('_upload_global');
    if (!node) {
      node = document.createElement('div');
      node.id = '_upload_global';
      node.style.display = 'none';
      document.body.appendChild(node);
    } else {
      ReactDOM.unmountComponentAtNode(node);
      lastResolve && lastResolve();
    }

    lastResolve = resolve;

    let resolve4;
    const beforeUpload = () => {
      return new Promise(resolve2 => {
        lastResolve = null;
        resolve(() => {
          return new Promise(resolve3 => {
            resolve4 = resolve3;
            resolve2();
          });
        });
      });
    };

    const onChange = (info) => {
      const status = info.file.status;
      if (status !== 'uploading') {
        ReactDOM.unmountComponentAtNode(node);
        node.parentNode.removeChild(node);
        resolve4({
          status: status === 'done',
          name: info.file.name,
          response: info.file.response
        });
      }
    };

    ReactDOM.render(<UploadComponent {...{url, onChange, beforeUpload}} />, node);
  });
};

export default upload;
