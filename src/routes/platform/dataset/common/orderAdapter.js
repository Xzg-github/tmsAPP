import {getObject} from '../../../../common/common';

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

const PROPS = [
  'filters',
  'buttons',
  'tableCols',
  'pageSize',
  'pageSizeType',
  'paginationConfig',
  'searchConfig'
];

const buildOrderPageState = (result, config, other={}) => {
  return {
    ...other,
    ...getObject(config, PROPS),
    keys: result.keys,
    maxRecords: result.returnTotalItem,
    currentPage: 1,
    tableItems: toTableItems(result) || [],
    searchData: {}
  };
};

export {toTableItems, buildOrderPageState};
