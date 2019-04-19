import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import {EnhanceLoading} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildOrderPageState} from '../../../common/state';
import helper, {fetchJson, getJsonResult} from '../../../common/common';
import {search} from '../../../common/search';
import {fetchDictionary, setDictionary} from '../../../common/dictionary';
import {dealActions} from '../../../common/check';

const STATE_PATH = [ 'customerContact'];
const URL_CONFIG = '/api/config/customer_contact/config';
const URL_LIST = '/api/config/customer_contact/list';
const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const dealExportButtons = (buttons, tableCols) => {
  return buttons.map(btn => {
    if (btn.key !== 'export' || !btn.menu) {
      return btn;
    }else {
      let newBtn = {...btn};
      newBtn.menu = newBtn.menu.map(menu => {
        if (['exportSearch', 'exportPage'].includes(menu.key)) {
          const subMenu = helper.getTemplateList(helper.getRouteKey(), tableCols);
          return {...menu, subMenu};
        }else {
          return menu;
        }
      });
      return newBtn;
    }
  });
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const {index, edit, names} = getJsonResult(await fetchJson(URL_CONFIG));
    const list = getJsonResult(await search(URL_LIST, 0, index.pageSize, {}));
    const dictionary = getJsonResult(await fetchDictionary(names));
    const payload = buildOrderPageState(list, index, {editConfig: edit, status: 'page', isSort: true});
    setDictionary(payload.tableCols, dictionary);
    setDictionary(payload.filters, dictionary);
    setDictionary(payload.editConfig.controls, dictionary);
    //初始化列表配置
    payload.tableCols = helper.initTableCols(helper.getRouteKey(), payload.tableCols);
    payload.buttons = dealActions( payload.buttons, 'customerContact');
    payload.buttons = dealExportButtons(payload.buttons, payload.tableCols);
    dispatch(action.create(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const mapStateToProps = (state) => {
  return helper.getObject(getSelfState(state), ['status', 'edit']);
};

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(OrderPageContainer);
export default connect(mapStateToProps, actionCreators)(Component);
export {dealExportButtons};
