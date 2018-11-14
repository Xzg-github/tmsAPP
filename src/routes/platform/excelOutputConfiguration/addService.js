import helper from '../../../common/common';
import {createContainer} from './addEditPageContainer';
import showDialog from '../../../standard-business/showDialog';

// 为EditDialog组件构建状态
const buildEditDialogState = (config={}, data, isEdit,index) => {
  return {
    isEdit,
    ...config,
    title: isEdit ? config.edit : config.add,
    value: data,
    index
  };
};

const addDriver = async (data,isEdit,tableItems={},index=0) => {
  try {
    const payload = buildEditDialogState(data.edit, tableItems,isEdit,index);
    showDialog(createContainer, payload);
  } catch(e) {
    helper.showError(e.message);
  }
};

export default addDriver;
