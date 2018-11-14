import {getObject} from '../../../common/common';

const INIT_PAGE = [
  'tree',
];

// 为OrderPage组件构建状态
const buildInitPageState = (treeConfig, other={}) => {
  return {
    ...other,
    ...getObject(treeConfig, INIT_PAGE),
  };
};


const EDIT_PAGE = [
  'config',
  'size',
  'controls',
  'buttons',
  'tableCols',
  'tableItems'
];

// 为EditPage组件构建状态
const buildEditPageState = (config={}, items, data, edit, index) => {
  return {
    edit,
    ...getObject(config, EDIT_PAGE),
    title: edit ? config.edit : config.add,
    value: data,
    tableItems: items,
    id: config.id,
    index
  };
};


// 创建删除状态
const buildDeleteState = () => {
  return {
    title: '请确认操作',
    ok: '确认',
    cancel: '取消',
    content: '是否确认删除'
  }
};


export {
  buildInitPageState,
  buildEditPageState,
  buildDeleteState
};
