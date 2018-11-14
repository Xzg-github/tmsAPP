import helper from '../../../../common/common';
import {fetchDictionary2, setDictionary,fetchDictionary} from '../../../../common/dictionary';
import {buildEditDialogState} from '../../../../common/state';
import {createContainer} from '../EditPageContainer';
import showDialog from '../../../../standard-business/showDialog';
import {buildEditPageState} from '../../../basic/currencyFile/common/state';

const URL_CONFIG = '/api/basic/defaultOutput/config';

const addDefaultOutput = async () => {
  try {
    const {edit,dicNames} = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
    const dictionary =  helper.getJsonResult(await fetchDictionary(dicNames));
    const payload = buildEditPageState(edit, {}, false);
    const adjust = {title: '新增 - 默认模板输出'};
    Object.assign(payload, adjust);
    setDictionary(payload.controls, dictionary);
    setDictionary(payload.tableCols, dictionary);
    showDialog(createContainer, payload);
  } catch(e) {
    helper.showError(e.message);
  }
};

export default addDefaultOutput;
