import helper from '../../../common/common';
import {buildEditDialogState} from '../../../common/state';
import {createContainer} from './AddEditDialogContainer';
import showDialog from '../../../standard-business/showDialog';

const URL_ADD_CONFIG = '/api/platform/urlResourceLib/addConfig';
const URL_ADD_CONTROLLER = '/api/platform/urlResourceLib/addController';

const addDriver = async (supplierGuid,EditControl) => {
  try {
    if(supplierGuid){
      const {edit} = helper.getJsonResult(await helper.fetchJson(URL_ADD_CONTROLLER));
      const payload = buildEditDialogState(edit, {}, true);
      const adjust = {title: '新增', valueParent: {supplierGuid}, readonly: ['supplierGuid'],EditControl:{EditControl}};
      Object.assign(payload, adjust);
      showDialog(createContainer, payload);
    }else {
      const {edit} = helper.getJsonResult(await helper.fetchJson(URL_ADD_CONFIG));
      const payload = buildEditDialogState(edit, {}, false);
      const adjust = {title: '新增'/*, value: {supplierGuid}, readonly: ['supplierGuid']*/};
      Object.assign(payload, adjust);
      showDialog(createContainer, payload);
    }
  } catch(e) {
    helper.showError(e.message);
  }
};

export default addDriver;
