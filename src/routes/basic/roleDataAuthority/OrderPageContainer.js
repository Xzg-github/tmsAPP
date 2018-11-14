import { connect } from 'react-redux';
import OrderPage from '../fromOddDefine/components/OrderPage/OrderPage';
import helper, {fetchJson, getObject, postOption, showError} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import {buildEditDialogState} from './common/state';

const STATE_PATH = ['basic', 'roleDataAuthority'];
const action = new Action(STATE_PATH);
const URL_ONE = '/api/basic/roleDataAuthority/one';
const URL_DEL = '/api/basic/roleDataAuthority/del';
const URL_SEARCH = '/api/basic/roleDataAuthority/search';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) => (dispatch) =>{
  dispatch(action.assign({[key]: value}, 'searchData'));
};

const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch, getState) =>{
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, 'tableItems', rowIndex));
};

const searchAction = async (dispatch, getState) => {
  const {searchData} = getSelfState(getState());
  const {result, returnCode} = await fetchJson(URL_SEARCH, postOption({...searchData}));
  if (returnCode !== 0) {
    showError('搜索失败, 未能找到');
    return;
  }

  return dispatch(action.assign({tableItems: result}));
};


const resetAction = (dispatch) =>{
  dispatch( action.assign({searchData: {}}) );
};

const addAction = (dispatch, getState) => {
  const {editConfig} = getSelfState(getState());
  const payload = buildEditDialogState(editConfig, {}, [], false);
  payload.data= editConfig.data;
  payload.merge= editConfig.merge;
  dispatch(action.assign(payload, 'edit'));
};


const x = (id ,data) => {
  let option = {};
  data.find((items) => {
    if (items.id === id) {
      option={
        value: items.id,
        title: items.ruleTypeName
      };
    }
  });
  return option;
};

const y = (tenantRuleTypeId, ruleId, data) => {
  let option = {};
  const list = data.find((items) => items.id === tenantRuleTypeId);
  list.relationList.find((items) => {
    if (items.id === ruleId) {
      option={
        value: items.id,
        title: items.ruleName
      };
    }
  });

  return option;
};

const getEdit = (result, data) => {
  let all = [];
  result.dataRoleRuleList && result.dataRoleRuleList.map((items, index) => {
    const content = items.content.reduce((result, item) => {
      result.push(item.value);
      return result;
    }, []);
    const options = {content: items.content};
    const tenantRuleTypeId = x(items.tenantRuleTypeId, data);
    const ruleId = y(items.tenantRuleTypeId, items.ruleId, data);
    const dataRoleRemark = items.dataRoleRemark;
    all.push({content: content, tenantRuleTypeId: tenantRuleTypeId, ruleId: ruleId, dataRoleRemark: dataRoleRemark, options});
  });
  return all;
};

const getoption = (items, data, merge) => {
  let tenantRuleTypeId, ruleId, array = [], arr;
  items.map((item) => {
    tenantRuleTypeId = item.tenantRuleTypeId.value;
    ruleId = item.ruleId.value;
    const {relationList} = data.find((item) => item.id === tenantRuleTypeId);
    const {relationTable} = relationList.find((item) => item.id === ruleId);
    if (relationTable === 'relation_table_user') {
      arr = merge.use.data.find(item => item.value === '0');
      if (arr) {
        item.options.content = merge.use.data
      }else {
        merge.use.data.unshift({value: '0', title: '本人'});
        item.options.content = merge.use.data
      }

    } else if (relationTable === 'relation_table_customer') {
      item.options.content = merge.customer
    } else if (relationTable === 'relation_table_supply') {
      item.options = merge.supply
    } else if (relationTable === 'relation_table_department') {
      arr = merge.department.data.find(item => item.value === '0');
      if (arr) {
        //merge.department.data.unshift({value: '0', title: '本部门'});
        item.options.content = merge.department.data
      }else {
        merge.department.data.unshift({value: '0', title: '本部门'});
        item.options.content = merge.department.data
      }

    }else if (relationTable === 'relation_table_institution') {
      merge.institution.data.map((data) => {
        array.push({
          value: data.guid,
          title: data.institutionName
        })
      });
      if (arr) {
        arr = array.find(item => item.value === '0');
      }else {
        array.unshift({value: '0', title: '本机构'});
        item.options.content = array;
      }
    }else if (relationTable === 'relation_table_task_unit') {
      //let array = [];
      merge.taskUnit.map((result) => {
        array.push({
          value: result.taskUnitCode,
          title: result.taskUnitTypeName
        })
      });
      item.options.content = array;
    }else  if (relationTable === 'relation_table_product') {
      merge.product.map((item) => {
        array.push({value: item.productTypeGuid.value, title: item.productTypeGuid.title})
      });
      item.options.content = array;
    }
  });
  return items;
};

const editAction = async (dispatch, getState) => {
  const {editConfig, tableItems, merge} = getSelfState(getState());
  const {data} = editConfig;
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index !== -1) {
    const item = tableItems[index];
    const {result} = await fetchJson(`${URL_ONE}/${item.id}`);
    const newData = helper.getObjectExclude(tableItems[index], ['checked']);
    const payload = buildEditDialogState(editConfig, newData, getEdit(result, data), true, index);
    payload.tableItems = getoption(getEdit(result, data), data, merge);
    payload.data = data;
    payload.merge = editConfig.merge;
    dispatch(action.assign(payload, 'edit'));
  }else {
    helper.showError('请勾选一个');
  }

};

const doubleClickActionCreator = (rowIndex) => async (dispatch, getState) => {
  const {editConfig, tableItems, merge} = getSelfState(getState());
  const item = tableItems[rowIndex];
  const {data} = editConfig;
  const {result} = await fetchJson(`${URL_ONE}/${item.id}`);
  const payload = buildEditDialogState(editConfig, tableItems[rowIndex], getEdit(result, data), false);
  payload.tableItems = getoption(getEdit(result, data), data, merge);
  payload.data = data;
  payload.merge = editConfig.merge;
  dispatch(action.assign(payload, 'edit'));
};

const delAction = async (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const index = helper.findOnlyCheckedIndex(tableItems);
  if (index === -1) {
    helper.showError('请勾选一条记录进行删除');
    return;
  }
  const item = tableItems[index];
  const {returnCode, returnMsg} = await fetchJson(`${URL_DEL}/${item.id}`, 'delete');
  if (returnCode === 0) {
    dispatch(action.del('tableItems', index));
    helper.showSuccessMsg('删除成功');
  }else {
    helper.showError(returnMsg);
  }
};



const toolbarActions = {
  reset: resetAction,
  search: searchAction,
  add: addAction,
  edit: editAction,
  del: delAction,
};

const clickActionCreator = (key) => {
  if (toolbarActions.hasOwnProperty(key)) {
    return toolbarActions[key];
  } else {
    console.log('unknown key:', key);
    return {type: 'unknown'};
  }
};


const mapStateToProps = (state) => {
  return getObject(getSelfState(state), OrderPage.PROPS);
};

const actionCreators = {
  onClick: clickActionCreator,
  onChange: changeActionCreator,
  onCheck: checkActionCreator,
  onDoubleClick: doubleClickActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(OrderPage);
export default Container;
