import {getObject} from '../../../../common/common';
const EDIT_DIALOG = [
  'controls',
  'buttons',
  'tableCols',
  'tableItems',
  'value',
  'config',
  'size',
];


// 为EditDialog2组件构建状态
const buildEditDialogState = (config, data={}, items= [], edit, editIndex) => {
  return {
    edit,
    ...getObject(config, EDIT_DIALOG),
    title: edit ? config.edit : config.add,
    value: data,
    tableItems: items,
    id: config.id,
    editIndex
  };
};

export {buildEditDialogState};
