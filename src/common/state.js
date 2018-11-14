import helper from './common';

const toTableItems = ({keys, data}) => {
  if (!keys) {
    return data;
  } else {
    return data.map((item) => {
      const children = keys.slice(1).reduce((state, key) => {
        state[key] = item[key];
        return state;
      }, {});
      return Object.assign(item[keys[0]], {children});
    });
  }
};

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

const EDIT_PAGE = [
  'label',
  'controls',
  'tableCols'
];

const EDIT_DIALOG = [
  'config',
  'size',
  'controls'
];

// 为OrderPage组件构建状态
const buildOrderPageState = (result, config, other={}) => {
  if (config.pageKey && config.buttons) {
    // 设置页面能够显示的按钮
    other.buttons = helper.getButtons(config.buttons, config.pageKey);
  }
  return {
    ...helper.getObject(config, ORDER_PAGE),
    ...other,
    maxRecords: result.returnTotalItem,
    currentPage: 1,
    tableItems: toTableItems(result),
    searchData: {}
  };
};

// 为EditPage组件构建状态
const buildEditPageState = ({keys, data={}}, config, other={}) => {
  const {from=0, to=0} = data;
  const pos = to - from;
  const items = keys ? data[keys[1]] : [];
  const tableItems = items.map((item, index) => {
    return index < pos ? Object.assign(item, {readonly: true}) : item;
  });
  return {
    ...other,
    ...helper.getObject(config, EDIT_PAGE),
    value: keys ? data[keys[0]] : {},
    tableItems
  };
};

// 为EditDialog组件构建状态
const buildEditDialogState = (config={}, data, edit) => {
  const isBatch =  edit === 'batchEdit';
  return {
    edit,
    ...helper.getObject(config, EDIT_DIALOG),
    title: isBatch ? config.title : edit ? config.edit : config.add,
    value: helper.getObjectExclude(data, ['checked']),
    options: {}
  };
};

export {
  toTableItems,
  buildOrderPageState,
  buildEditPageState,
  buildEditDialogState
};
