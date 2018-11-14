import { connect } from 'react-redux';
import {EnhanceLoading, EnhanceEditDialog} from '../../components/Enhance';
import {Action} from '../../action-reducer/action';
import {getPathValue} from '../../action-reducer/helper';
import {buildOrderPageState} from '../../common/state';
import helper from '../../common/common';
import {search} from '../../common/search';
import {fetchDictionary2, setDictionary} from '../../common/dictionary';
import {dealActions} from '../../common/check';

const createRootContainer = (urls, statePath, OrderPageContainer, EditDialogContainer, importCode, jurisdictionKey) => {
  const NEED_PROPS = ['status', 'edit'];
  const {URL_CONFIG, URL_LIST} = urls;
  const STATE_PATH = statePath;
  const action = new Action(STATE_PATH);

  const getSelfState = (rootState) => {
    return getPathValue(rootState, STATE_PATH);
  };

  const initActionCreator = () => async (dispatch) => {
    try {
      dispatch(action.assign({status: 'loading'}));
      const {index, edit} = helper.getJsonResult(await helper.fetchJson(URL_CONFIG));
      const list = helper.getJsonResult(await search(URL_LIST, 0, index.pageSize, {}));
      const dictionary = helper.getJsonResult(await fetchDictionary2(index.tableCols));
      const payload = buildOrderPageState(list, index, {editConfig: edit, status: 'page'}, importCode);
      setDictionary(payload.tableCols, dictionary);
      if(index.apportionmentRuleConfig){
        setDictionary(index.apportionmentRuleConfig.controls, dictionary);
        Object.assign(payload,{apportionmentRuleConfig:index.apportionmentRuleConfig});
      }
      setDictionary(payload.tableCols, dictionary);
      setDictionary(payload.filters, dictionary);
      setDictionary(payload.editConfig.controls, dictionary);
      payload.buttons = dealActions( payload.buttons, jurisdictionKey);
      dispatch(action.create(payload));
    } catch (e) {
      helper.showError(e.message);
      dispatch(action.assign({status: 'retry'}));
    }
  };

  const mapStateToProps = (state) => {
    return helper.getObject(getSelfState(state), NEED_PROPS);
  };

  const actionCreators = {
    onInit: initActionCreator
  };

  const Component = EnhanceLoading(EnhanceEditDialog(OrderPageContainer, EditDialogContainer));
  return connect(mapStateToProps, actionCreators)(Component);
};

export default createRootContainer;
