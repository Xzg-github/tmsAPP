import React from 'react';
import ReactDOM from 'react-dom';
import ModeImport from '../components/ModeImport';
import {fetchJson, showError} from './common';

const showImportDialog = async (modeCode, afterImportFunc = undefined, isDetail = false, indexId='', indexKey='') => {
  const url = '/api/config/modeinput/list';
  const {returnCode, result} = await fetchJson(`${url}?modelTypeCode=${modeCode}`);
  if(returnCode !== 0) {
    showError('获取模板列表失败');
    return;
  }
  const options = result.map((item) => ({
    value: item.id,
    title: item.modelName
  }));
  let myElement = document.getElementById('globalContainer');
  if (!myElement) {
    myElement = document.createElement("div");
    myElement.id = 'globalContainer';
    document.body.appendChild(myElement);
  }
  const onCancel = () => {
    ReactDOM.unmountComponentAtNode(myElement);
  };
  const onOk = () => {
    ReactDOM.unmountComponentAtNode(myElement);
    afterImportFunc && afterImportFunc();
  };
  const props = {
    config: {
      title: '模板导入',
      modeName: '模板名称',
      downLabel: '还没有该模板？点此下载',
      selectFile: '选择模板文件',
      startImport: '开始导入',
      result: '导入报告',
      progress: '  导入进度：'
    },
    modeCode,
    options,
    onOk,
    onCancel,
    isDetail,
    indexId,
    indexKey
  };
  ReactDOM.render(<ModeImport {...props} />, myElement);
};

export {showImportDialog};
