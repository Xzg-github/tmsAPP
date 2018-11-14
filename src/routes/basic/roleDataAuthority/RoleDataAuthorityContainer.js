import { connect } from 'react-redux';
import OrderPageContainer from './OrderPageContainer';
import EditDialogContainer from './EditDialogContainer';
import {EnhanceLoading, EnhanceEditDialog} from '../../../components/Enhance';
import {Action} from '../../../action-reducer/action';
import {buildOrderPageState} from '../../../common/state';
import helper, {fetchJson, getJsonResult, postOption} from '../../../common/common';
import {getPathValue} from '../../../action-reducer/helper';

const STATE_PATH = ['basic', 'roleDataAuthority'];
const action = new Action(STATE_PATH);
const URL_CONFIG = '/api/basic/roleDataAuthority/config';
const URL_LIST = '/api/basic/roleDataAuthority/search';
const URL_ALL_DATA = '/api/basic/roleDataAuthority/all_data';
const NAME_URL = '/api/basic/roleDataAuthority/user';  // 用户
const URL_SUPPLIER_DROP_LIST = '/api/basic/roleDataAuthority/name';  // 客户
const URL_SEARCH_NAME = '/api/basic/roleDataAuthority/search/name';  // 供应商
const URL_BRANCH = '/api/basic/roleDataAuthority/branch';  // 部门
const URL_INSTITUTION = '/api/basic/institution/list'; // 机构

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const setPerson = (colsList, person) => {
  colsList.some((cols) => {
    if (cols.key === 'tenantRuleTypeId') {
      cols.options = person;
    }
  });
};

const typeArr = (data) => {
  const arr = data.reduce((result, items)=> {
    result.push({value: items.id, title: items.ruleTypeName});
    return result;
  }, []);
  return arr;
};

const initActionCreator = () => async (dispatch) => {
  try {
    dispatch(action.assign({status: 'loading'}));
    const data = getJsonResult(await fetchJson(URL_ALL_DATA));
    const use = getJsonResult(await fetchJson(NAME_URL, postOption({itemFrom:0, itemTo:65536,filter: {}})));
    const customer = getJsonResult(await fetchJson(URL_SUPPLIER_DROP_LIST, postOption({filter: '', maxNumber:65536})));
    const supply = getJsonResult(await fetchJson(URL_SEARCH_NAME, postOption({filter: '', maxNumber:65536})));
    const department = getJsonResult(await fetchJson(URL_BRANCH, postOption({itemFrom:0, itemTo:65536})));
    const institution = getJsonResult(await fetchJson(URL_INSTITUTION, postOption({itemFrom:0, itemTo:65536, filter:{}})));
    const merge = {use, customer, supply, department, institution};
    const {index, edit} = getJsonResult(await fetchJson(URL_CONFIG));
    const result = getJsonResult(await fetchJson(URL_LIST, postOption({})));
    const list = {
      result: {
        data: result
      }
    };
    const payload = buildOrderPageState(list.result, index, {editConfig: edit});
    const person = typeArr(data);
    payload.merge = merge;
    payload.editConfig.data = data;
    payload.editConfig.merge = merge;
    payload.status = 'page';
    setPerson(payload.editConfig.tableCols, person);
    dispatch(action.create(payload));
  } catch (e) {
    helper.showError(e.message);
    dispatch(action.assign({status: 'retry'}));
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onInit: initActionCreator
};

const Component = EnhanceLoading(EnhanceEditDialog(OrderPageContainer, EditDialogContainer));
const Container = connect(mapStateToProps, actionCreators)(Component);
export default Container;
