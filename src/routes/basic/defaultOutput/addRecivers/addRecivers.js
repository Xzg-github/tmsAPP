import {createContainer} from '../addEditPageContainer';
import showDialog from '../../../../standard-business/showDialog';
import helper,{fetchJson} from '../../../../common/common';


const URL_ADD_CONFIG = '/api/basic/defaultOutput/reciversConfig';

// 为EditDialog组件构建状态
const buildEditDialogState = (config,tableItems =[],index,type) => {

  return {
    title: "设置接受信息",
    ...config,
    tableCols:config[type],
    tableItems: tableItems,
    index
  };
};


const addDriver = async (tableItems,index,type) => {
  try {
    tableItems = tableItems ? JSON.parse(tableItems) : [];
    const config = await fetchJson(URL_ADD_CONFIG);
    const payload = buildEditDialogState(config.result, tableItems,index,type);
    showDialog(createContainer, payload);
  } catch(e) {
    helper.showError(e.message);
  }
};

export default addDriver;
