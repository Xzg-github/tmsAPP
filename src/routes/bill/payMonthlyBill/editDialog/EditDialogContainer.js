/*
* 编辑页面点击编辑结算单位页面
* */
import {connect} from 'react-redux';
import EditDialog from './EditDialog';
import {Action} from '../../../../action-reducer/action';
import showPopup from '../../../../standard-business/showPopup';
import helper, {showError} from '../../../../common/common';
import {getPathValue} from '../../../../action-reducer/helper';


const URL_JOIN = '/api/bill/pay_monthly_bill/joinSettlement';//应付月帐单加入对账明细
const URL_DEL = '/api/bill/pay_monthly_bill/del';//删除明细

const action = new Action(['temp']);

//刷新表格
const refresh = async(dispatch, value) => {
  const url = `${URL_LIST}/${value.id}?filter=${value.transportOrderId}`;
  const json = await helper.fetchJson(url);
  if(json.returnCode !== 0 ){
    helper.showError(json.returnMsg);
    return
  }
  dispatch(action.assign({tableItems:json.result}))
};

const getSelfState = (state) => {
  return getPathValue(state, ['temp']);
};


const closeActionCreator = () => (dispatch) => {
  dispatch(action.assign({visible: false, ok: true}));
};


const delActionCreator  = () => async(dispatch,getState) => {
  try {
    const {value,tableItems} = getSelfState(getState());
    const items = tableItems.filter(item => item.checked);
    if(items.length > 0) {
      const body = {
        currency:value.currency,
        supplierId:value.supplierId,
        transportOrderId:value.transportOrderId,
        payableMonthBillId:value.id,
        detailIdList:items.map(item => item.id)

      };
      const json = helper.getJsonResult(await helper.fetchJson(URL_DEL,helper.postOption(helper.convert(body),'delete')));
      helper.showSuccessMsg('删除成功')
      await refresh(dispatch,value)
    }

  }catch (e){
    helper.showError(e.message)
  }
};

const addActionCreator   = () => async(dispatch,getState) => {
  try {
    const {value} = getSelfState(getState());
    const body = helper.convert({
      currency:value.currency,
      supplierId:value.supplierId,
      payableMonthBillId:value.id,
      transportOrderId:value.transportOrderId
    });
    const json = await helper.fetchJson(URL_JOIN,helper.postOption(body));
    if(json.returnCode !== 0){
      helper.showError(json.returnMsg);
      return
    }
    helper.showSuccessMsg(json.returnMsg);
    await refresh(dispatch,value)
  }catch (e){
    helper.showError(e.message)
  }
};


const clickActionCreators = {
  del:delActionCreator,
  join:addActionCreator,
};

const clickActionCreator = (key) => {
  if (clickActionCreators.hasOwnProperty(key)) {
    return clickActionCreators[key]();
  } else {
    return {type: 'unknown'};
  }
};


const exitValidActionCreator = () => {
  return action.assign({valid: false});
};




const mapStateToProps = (state) => {
  return getSelfState(state);
};


const checkActionCreator = (isAll, checked, rowIndex) =>  (dispatch,getState) =>{
  const {tabKey} = getSelfState(getState());
  isAll && (rowIndex = -1);
  dispatch(action.update({checked}, ['tableItems'], rowIndex));
};

const actionCreators = {
  onClick: clickActionCreator,
  onExitValid:exitValidActionCreator,
  onClose: closeActionCreator,
  onCheck: checkActionCreator,
};


const buildState = (config,result=[],value) => {
  return {
    ...config,
    tableItems: result,
    visible:true,
    value
  }
};

const URL_LIST = '/api/bill/pay_monthly_bill/monthId';//根据月帐单标识及应收结算单标识返回列表信息
export default async(config,item,value) => {
  try {
    const url = `${URL_LIST}/${value.id}?filter=${item.transportOrderId}`;
    value.transportOrderId = item.transportOrderId;
    const json = helper.getJsonResult(await helper.fetchJson(url));
    const Container = connect(mapStateToProps, actionCreators)(EditDialog);
    global.store.dispatch(action.create(buildState(config,json,value)));
    await showPopup(Container,{}, true);

    const state = getSelfState(global.store.getState());
    global.store.dispatch(action.create({}));
    return state.ok;
  }catch (e){
    helper.showError(e.message)
  }

}
