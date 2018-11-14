import {getObject} from '../../../../common/common';
import {toTableItems} from '../../../../common/state'

const ORDER_PAGE = [
  'filters',
  'buttons',
  'tableCols',
  'pageSize',
  'pageSizeType',
  'paginationConfig', // 该属性被废弃，被description替代
  'description',
  'searchConfig'
];


// 为OrderPage组件构建状态
const buildOrderPageState = (result, config, other={}) => {
  const keys = other.keys || result.keys || [];
  return {
    ...other,
    ...getObject(config, ORDER_PAGE),
    keys,
    maxRecords: result.length,
    currentPage: 1,
    tableItems: toTableItems({data: result}),
    searchData: {}
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
const buildEditPageState = (config={}, data, edit) => {
  return {
    edit,
    ...getObject(config, EDIT_PAGE),
    title: edit ? config.edit : config.add,
    value: data
  };
};

export {
  toTableItems,
  buildOrderPageState,
  buildEditPageState
};
