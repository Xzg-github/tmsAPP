import {getObject} from '../../../../common/common';

const EDIT_PAGE = [
  'config',
  'size',
  'options',
];

// 为EditPage组件构建状态
const buildEditPageState = (config={}, data) => {
  return {
    ...getObject(config, EDIT_PAGE),
    title: config.join,
    value: data
  };
};

export {
  buildEditPageState
};
