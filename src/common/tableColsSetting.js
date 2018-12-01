import SetColDialog from '../components/SetColDialog';
import {fetchJson, postOption} from './common';
import showPopup from '../standard-business/showPopup';

const URL_SETTING = '/api/permission/table_cols_setting';

const options = [
  {title: '字符串', value:'string'},
  {title: '数值', value:'number'},
  {title: '无', value: 'noSort'}
];

const KEYS = ['checked', 'index', 'title', 'sorter', 'hide', 'filter'];

const showColsSetting = (cols, okFunc, code, keys=KEYS) => {
  const onOk = async (newCols) => {
    okFunc(newCols);
    let hideKeys=[], sortKeys=[], filterKeys=[], keysIndex=[];
    newCols.map(({key, hide, sorter, filter}) => {
      keysIndex.push(key);
      hide && hideKeys.push(key);
      sorter && sortKeys.push({key, sorter});
      filter && filterKeys.push(key);
    });
    code && await fetchJson(URL_SETTING, postOption({code, config: {hideKeys, sortKeys, filterKeys, keysIndex}}));
  };
  const props = {
    ok: '确定',
    cancel: '取消',
    title: '配置字段',
    buttons: [
      {key:'up', title: '前移'},
      {key:'down', title: '后移'}
    ],
    tableCols:[
      {key: 'checked', title: '', type: 'checkbox'},
      {key: 'index', title: '序号', type: 'index'},
      {key:'title', title: '字段名', type: 'readonly'},
      {key:'sorter', title: '排序', type: 'select', options, sign: "sorter"},
      {key:'hide', title: '隐藏', type: 'switch', sign: "hide"},
      {key:'filter', title: '过滤', type: 'switch', sign: "filter"}
    ],
    cols,
    onOk
  };
  if (Array.isArray(keys)){
    props.tableCols = props.tableCols.filter(col => !col.sign || keys.includes(col.sign));
  }
  return showPopup(SetColDialog, props);
};

export {showColsSetting};
