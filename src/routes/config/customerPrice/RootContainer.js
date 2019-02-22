import {connect} from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EditPageContainer from './EditPage/EditPageContainer';
import {EnhanceLoading} from '../../../components/Enhance';
import {createCommonTabPage} from '../../../standard-business/createTabPage';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildOrderPageState} from '../../../common/state';
import helper, {fetchJson, getJsonResult} from '../../../common/common';
import {search} from '../../../common/search';
import {fetchDictionary, setDictionary, getStatus} from '../../../common/dictionary';
import {dealActions} from '../../../common/check';

const STATE_PATH = ['customerPrice'];
const URL_CONFIG = '/api/config/customerPrice/config';
const URL_LIST = '/api/config/customerPrice/list';

const action = new Action(STATE_PATH);

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const {activeKey, tabs, index, editConfig, names} = getJsonResult(await fetchJson(URL_CONFIG));
    const list = getJsonResult(await search(URL_LIST, 0, index.pageSize, {}));
    const other = {activeKey, tabs, editConfig, status: 'page'};
    const payload = buildOrderPageState(list, index, other);
    let dictionary = getJsonResult(await fetchDictionary(names));
    dictionary['status_type'] = getJsonResult(await getStatus('customer_price'));
    setDictionary(payload.filters, dictionary);
    setDictionary(payload.tableCols, dictionary);
    // setDictionary(payload.editConfig.controls, dictionary);
    payload.buttons = dealActions(payload.buttons, 'customer_price');
    dispatch(action.create(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const tabChangeActionCreator = (key) => action.assign({activeKey: key});

const tabCloseActionCreator = (key) => (dispatch, getState) => {
  const {activeKey, tabs} = getSelfState(getState());
  const newTabs = tabs.filter(tab => tab.key !== key);
  if (activeKey === key) {
    let index = tabs.findIndex(tab => tab.key === key);
    (newTabs.length === index) && (index--);
    dispatch(action.assign({tabs: newTabs, [activeKey]: undefined, activeKey: newTabs[index].key}));
  } else {
    dispatch(action.assign({tabs: newTabs, [key]: undefined}));
  }
};

const mapStateToProps = (state) => getSelfState(state);

const actionCreators = {
  onInit: initActionCreator,
  onTabChange: tabChangeActionCreator,
  onTabClose: tabCloseActionCreator
};

const Component = EnhanceLoading(createCommonTabPage(OrderPageContainer, EditPageContainer));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
