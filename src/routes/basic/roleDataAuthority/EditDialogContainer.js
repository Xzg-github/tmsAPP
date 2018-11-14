import { connect } from 'react-redux';
import EditDialog2 from '../../../components/EditDialog2';
import helper, {postOption, fetchJson, showError, validValue} from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';


const STATE_PATH = ['basic', 'roleDataAuthority', 'edit'];
const action = new Action(STATE_PATH);
const CLOSE_ACTION = action.assignParent({edit: undefined});

const URL_SAVE = '/api/basic/roleDataAuthority';
const URL_LIST = '/api/basic/roleDataAuthority/search';

const getSelfState = (rootState) => {
  return getPathValue(rootState, STATE_PATH);
};

const changeActionCreator = (key, value) => {
  return action.assign({[key]: value}, 'value');
};

const exitValidActionCreator = () => {
  return action.assign({valid: false});
};

const tableExitValidActionCreator = () => {
  return action.assign({tableValid: false});
}

const findRelation = (typeId, data) => {
  const list = data.find((item) => item.id === typeId);
  return list;
};

const getOption = (list) => {
  const arr = list.reduce((result, item) => {
    result.push({value: item.id, title: item.ruleName});
    return result;
  }, []);
  return arr;
};

const contentChangeActionCreator = (rowIndex, keyName, value) => async (dispatch, getState) => {
  const {tableItems, data, merge, edit} = getSelfState(getState());
  if (keyName === 'tenantRuleTypeId') {
    if (!value) {
      dispatch(action.update({[keyName]: value, ['ruleId']: value, ['content']: value}, 'tableItems', rowIndex));
      return
    }
    const {relationList} = findRelation(value.value, data);
    const arr = getOption(relationList);
    tableItems[rowIndex].options = {
      ruleId: arr
    };
  }
  if (keyName === 'ruleId') {
    if (!value) {
      const id = tableItems[rowIndex].tenantRuleTypeId.value;
      const {relationList} = findRelation(id, data);
      const arr = getOption(relationList);
      tableItems[rowIndex].options = {
        ruleId: arr
      };
      const options = tableItems[rowIndex].options;
      dispatch(action.update({[keyName]: value, ['content']: value, options}, 'tableItems', rowIndex));
      return;
    }
    let ruleObj;
    data.find((item)=> {
      ruleObj = item.relationList.find((item) => item.id === value.value);
      return ruleObj
    });
    const parameter = ruleObj.relationTable;
    let newItem;
    if (parameter === 'relation_table_user') {
      newItem = merge.use.data.find(item => item.value === '0');
      if (newItem) {
        tableItems[rowIndex].options = {
          content:merge.use.data
        };
      }else {
        merge.use.data.unshift({value: '0', title: '本人'});
        tableItems[rowIndex].options = {
          content:merge.use.data
        };
      }
    }
    else if (parameter === 'relation_table_customer') {
      //const {result} = await fetchJson(URL_SEARCH_NAME, postOption({filter: ''}));
      tableItems[rowIndex].options = {
        content:  merge.customer
      };
    }
    else if (parameter === 'relation_table_supply') {
      //const {result} = await fetchJson(URL_SUPPLIER_DROP_LIST, postOption({filter: ''}));
      tableItems[rowIndex].options = {
        content:  merge.supply
      };
    }
    else if (parameter === 'relation_table_department') {
      newItem = merge.department.data.find(item => item.value === '0');;
      if (newItem) {
        tableItems[rowIndex].options = {
          content: merge.department.data
        };
      }else {
        merge.department.data.unshift({value: '0', title: '本部门'});
        tableItems[rowIndex].options = {
          content: merge.department.data
        };
      }

    }
    else if (parameter === 'relation_table_institution') {
      let array = [];
      merge.institution.data.map((data) => {
        array.push({
          value: data.guid,
          title: data.institutionName
        })
      });
      newItem = array.find(item => item.value === '0');
      if (newItem) {
        tableItems[rowIndex].options = {
          content: array
        };
      }else {
        array.unshift({value: '0', title: '本机构'});
        tableItems[rowIndex].options = {
          content: array
        };
      }

    }
    else if (parameter === 'relation_table_task_unit') {
      //const {result} = await fetchJson(URL_ACTIVE_JOBS);
      let array = [];
      merge.taskUnit.map((result) => {
        array.push({
          value: result.taskUnitCode,
          title: result.taskUnitTypeName
        })
      });
      tableItems[rowIndex].options = {
        content: array
      };
    }
    else  if (parameter === 'relation_table_product') {
      let array = [];
      merge.product.map((item) => {
        array.push({value: item.productTypeGuid.value, title: item.productTypeGuid.title})
      });
      tableItems[rowIndex].options = {
        content: array
      };
    }
  }
  if(keyName === 'tenantRuleTypeId' || keyName === 'ruleId' || keyName === 'content'){
    const options = tableItems[rowIndex].options;
    dispatch(action.update({[keyName]: value, options}, 'tableItems', rowIndex));
  }else{
    dispatch(action.update({[keyName]: value}, 'tableItems', rowIndex));
  }
};

const getContent = (contentArr, options) => {
  let newContent = [];
  contentArr.map((items) => {
    newContent.push(options.find((item) => item.value === items ))
  });
  return newContent
};

const changeList = (list) => {
  let arr = [];
  list.map((items) => {
    // const content = items.content.reduce((result, item) => {
    //   result.push({value: item, title: item});
    //   return result
    // }, []);
    const content = getContent(items.content, items.options.content);
    const ruleId = items.ruleId.value;
    const tenantRuleTypeId = items.tenantRuleTypeId.value;
    const dataRoleRemark = items.dataRoleRemark;
    arr.push({content: content, ruleId: ruleId, tenantRuleTypeId: tenantRuleTypeId, dataRoleRemark: dataRoleRemark})
  });
  return arr;
};

const okActionCreator = () => async (dispatch, getState) => {
  const {edit, value, tableItems, controls, tableCols} = getSelfState(getState());
  if(!tableItems || tableItems.length <= 0){
    showError('新增行必须有');
    return;
  }
  if(!validValue(controls,value)){
    dispatch(action.assign({valid: true}));
    return;
  }
  if (!helper.validArray(tableCols, tableItems)) {
    dispatch(action.assign({tableValid: true}));
    return;
  }
  const newValue = {
    ...value,
    dataRoleRuleList: changeList(tableItems)
  };

  const option = postOption(newValue, edit ? 'put': 'post');
  const {returnCode, returnMsg} = await fetchJson(URL_SAVE, option);
  if (returnCode !== 0) {
    showError(returnMsg);
    return;
  }
  const res = await fetchJson(URL_LIST, postOption({}));
  dispatch(action.assignParent({tableItems: res.result, edit: undefined}));

};

const cancelActionCreator = () => (dispatch) => {
  dispatch(CLOSE_ACTION);
};

const addRowAction = (dispatch) => {
  dispatch( action.add({ruleId: '', content: ''}, 'tableItems') );
};

const delRowAction = (dispatch, getState) => {
  const {tableItems} = getSelfState(getState());
  const newItems = tableItems.filter(item => item.checked != true);
  dispatch(action.assign({tableItems: newItems}));
};


const buttonActions = {
  add: addRowAction,
  del: delRowAction
};

const clickActionCreator = (key) => {
  if (buttonActions.hasOwnProperty(key)) {
    return buttonActions[key];
  } else {
    helper.showError(`unknown key:${key}`);
    return {type: 'unknown'};
  }
};


const mapStateToProps = (state) => {
  return getSelfState(state);
};

const actionCreators = {
  onChange: changeActionCreator,
  //onSearch: formSearchActionCreator,
  onExitValid: exitValidActionCreator,
  onOk: okActionCreator,
  onClick: clickActionCreator,
  onContentChange: contentChangeActionCreator,
  onTableExitValid: tableExitValidActionCreator,
  onCancel: cancelActionCreator
};

const Container = connect(mapStateToProps, actionCreators)(EditDialog2);
export default Container;
