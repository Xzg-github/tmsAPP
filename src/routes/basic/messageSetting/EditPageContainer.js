import { connect } from 'react-redux';
import helper from '../../../common/common';
import {Action} from '../../../action-reducer/action';
import {getPathValue} from '../../../action-reducer/helper';
import showDialog from '../../../standard-business/showDialog';
import EditPage from './components/EditPage/EditPage'
import {showSelectDialog} from '../../message/business/SendInfoDialog/SelectDialog';
import {toFormValue} from '../../../common/check';


const URL_THEME = '/api/platform/messageTheme/list';//消息标题下拉
const URL_ADD = '/api/basic/messageSetting/add';//新增
const URL_DEP = '/api/basic/messageSetting/department';//部门与机构联动

//list消息主题的
const handleControls = (controls,list,keyValue,value) => {
  let item = list.filter(item => {
    return item.id === keyValue
  });

  if(item.length > 0) {
    item = item[0]
  }else {
    return {newControls:controls,newValue:value}
  }


  for(let col of controls){
    switch(col.key){
      case 'institutionId':{
        col.type = item.isInstitution === 1 ? 'search' : 'readonly';
        break;
      }
      case 'customerId':{
        col.type = item.isCustomer === 1 ? 'search' : 'readonly';
        break;
      }
      case 'productTypeId':{
        col.type = item.isProductType === 1 ? 'search' : 'readonly';
        break;
      }
      case 'taskUnitTypeId':{
        col.type = item.isTaskUnitType === 1 ? 'search' : 'readonly';
        break;
      }
      case 'lifecycleId':{
        col.type = item.isLifecycle === 1 ? 'search' : 'readonly';
        break;
      }
      case 'supplierId':{
        col.type = item.isSupplier === 1 ? 'search' : 'readonly';
        break;
      }
      case 'departmentId':{
        col.type = item.isDepartment === 1 ? 'search' : 'readonly';
      }
    }

    if(value[col.key] && col.type === 'readonly'){
      delete value[col.key]

    }

  }


  let newControls = controls;
  let newValue = value;
  return {newControls,newValue}
};

const createContainer = (statePath, afterEditActionCreator) => {
  const action = new Action(statePath, false);

  const getSelfState = (rootState) => {
    return getPathValue(rootState, statePath);
  };

  const checkActionCreator = (isAll, checked, rowIndex) => {
    isAll && (rowIndex = -1);
    return action.update({checked}, 'tableItems', rowIndex);
  };


  const cancelActionCreator= () =>  (dispatch, getState) => {
    afterEditActionCreator()();
  };




  const changeActionCreator = (keyName, keyValue) => async (dispatch, getState) => {
    const {controls,theMe,value} = getSelfState(getState());

    if(keyName === 'messageTitleConfigId' && keyValue){
      const {newControls,newValue} = handleControls(JSON.parse(JSON.stringify(controls)),theMe,keyValue,{...value});
      dispatch(action.assign({controls:newControls,value:newValue}));
    }
    if(keyName === 'productTypeId'){
      dispatch(action.assign({['taskUnitTypeId']: ''}, 'value'));
      dispatch(action.assign({['lifecycleId']: ''}, 'value'));
      dispatch(action.update({options:[]}, 'controls', 4));
      dispatch(action.update({options:[]}, 'controls', 5));
    }else if(keyName === 'taskUnitTypeId'){
      dispatch(action.assign({['lifecycleId']: ''}, 'value'));
      dispatch(action.update({options:[]}, 'controls', 5));
    }else if(keyName === 'institutionId'){
      dispatch(action.assign({['departmentId']: ''}, 'value'));
      dispatch(action.update({options:[]}, 'controls', 7));
    }

    dispatch(action.assign({[keyName]: keyValue}, 'value'));
  };


  const exitValidActionCreator = () => {
    return action.assign({valid: false});
  };

  // 根据option中的searchType或searchUrl进行模糊搜索
  //服务类型只读的话作业单元拿全部要
  //机构只读的话部门拿全部要
  const fuzzySearchEx = async(filter, option, key,value,controls,dispatch) => {
    if (option.hasOwnProperty('searchType')) {
      return helper.fuzzySearch(option.searchType, filter);
    } else if (option.hasOwnProperty('searchUrl')) {
      if(key === 'productTypeId'){
        return helper.fetchJson(option.searchUrl);
      }
      if(key === 'taskUnitTypeId'){
        if(value.productTypeId && value.productTypeId.value){
          return helper.fetchJson(option.searchUrl,helper.postOption([value.productTypeId.value]))
        }else if(controls[3].type === 'readonly'){
          return helper.fuzzySearch('job_unit_code', filter);
        }
        dispatch(action.update({options:[]}, 'controls', 4));
        return {returnCode : -1,returnMsg:'请先选择服务类型'}
      }
      if(key === 'departmentId'){
        if(controls[1].type === 'readonly'){
          const json = await helper.fetchJson(option.searchUrl,helper.postOption({filter: ''}));
          return json.returnCode === 0 ? {result:json.result.data,returnCode:0} : json
        }else if(value.institutionId && value.institutionId.value){
          return helper.fetchJson(`${URL_DEP}/${value.institutionId.value}`)
        }

        dispatch(action.update({options:[]}, 'controls', 7));
        return {returnCode : -1,returnMsg:'请先选择机构'}

      }
      if(key === 'userId'){
        const json = await helper.fetchJson(option.searchUrl,helper.postOption({itemFrom:0, itemTo:65536,filter: {}}));
        return json.returnCode === 0 ? {result:json.result.data,returnCode:0} : json

      }
      if(key === 'lifecycleId'){
        if(value.taskUnitTypeId && value.taskUnitTypeId.value){
          return helper.fetchJson(`${option.searchUrl}/${value.taskUnitTypeId.value}`)
        }
        return {returnCode : -1,returnMsg:'请先选择作业单元'}

      }
    } else {
      return {returnCode: -1, returnMsg: '无效参数'};
    }
  };


  const searchActionCreator = (key, keyValue, keyControl) => async (dispatch,getState) => {
    const {controls,value} = getSelfState(getState());
    const json = await fuzzySearchEx(keyValue, keyControl,key,value,controls,dispatch);
    if (!json.returnCode) {
      const index = controls.findIndex(item => item.key == key);
      dispatch(action.update({options:json.result}, 'controls', index));
    }else {
      helper.showError(json.returnMsg)
    }
  };

  const okActionCreator = () => async (dispatch, getState) => {
    const {tableItems,okFunc,value,controls,edit} = getSelfState(getState());
    if (!helper.validValue(controls, value)) {
      dispatch(action.assign({valid: true}));
      return;
    }

    if(tableItems.length < 1){
      helper.showError('订阅用户不能为空');
      return
    }


    if(tableItems.some(o=>!o.userEmail && o.sendMethod.includes('email'))){
      return helper.showError('存在不支持邮箱方式发送的数据！');
    }
    if(tableItems.some(o=>!o.userPhone && o.sendMethod.includes('sms'))){
      return helper.showError('存在不支持短信方式发送的数据！');
    }

    value.userList = tableItems.map(item => {
      return {
        userId : item.userId.value,
        sendMethod : JSON.stringify(item.sendMethod),
        userEmail:item.userEmail ? item.userEmail :'',
        userPhone:item.userPhone ? item.userPhone :'',
       }

    });
    const options = helper.postOption(toFormValue(value),edit ? "put" : "post");
    let data = await helper.fetchJson(URL_ADD, options);
    if (data.returnCode !== 0) {
      helper.showError(data.returnMsg);
      return;
    }

    okFunc && okFunc();
    afterEditActionCreator()();

  };

  const assignArray = (oldData,assignData) => {
   let addItems = [],noRepeatData,repeatData,newData;
   assignData.forEach(item => {
     addItems.push({
       userId:{
         value:item.id,
         title:item.userName
       },
       userEmail:item.email ? item.email :'',
       userPhone:item.mobile ? item.mobile :'',
       sendMethod:item.sendType,
     })

   });

    if(oldData.length > 0){
       repeatData = addItems.filter(o => oldData.map(a => a.userId.value).includes(o.userId.value));
       noRepeatData = addItems.filter(o=>!(oldData.map(a=>a.userId.value).includes(o.userId.value)));

      let newData = oldData.concat(noRepeatData);

      newData.forEach(o=>{
        repeatData.map(a=>{
          if(o.userId.value === a.userId.value){
            o.sendMethod = Array.from(new Set(o.sendMethod.concat(a.sendMethod)));
          }
        });
      });
      return newData;
    }else {
      newData = addItems
      return newData;
    }
  };


  const addAction = (dispatch, getState) => {
    const {fromArchives,tableItems} = getSelfState(getState());
    const onSelectDialogOk = async (data) => {

      const newItems = assignArray(tableItems,data);
      dispatch(action.assign({tableItems:newItems}));
    };
    showSelectDialog(fromArchives,onSelectDialogOk,'fromArchives', false);
  };

  const delAction = (dispatch, getState) => {
    const {tableItems} = getSelfState(getState());
    const newItems = tableItems.filter(item => !item.checked);
    dispatch(action.assign({tableItems: newItems}));
  };


  const toolbarActions = {
    add: addAction,
    delete:delAction
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
    return getSelfState(state);
  };

  const actionCreators = {
    onOk: okActionCreator,
    onCancel: cancelActionCreator,
    onChange: changeActionCreator,
    onCheck:checkActionCreator,
    onSearch: searchActionCreator,
    onClick:clickActionCreator,
    onExitValid: exitValidActionCreator,
  };

  return connect(mapStateToProps, actionCreators)(EditPage);
};

const showDiaLog = (config,item,data,okFunc,edit) => {
  let editControls,editValue;

  if(edit){
    item = JSON.parse(JSON.stringify(item));
    item.forEach(o => {
      try {
        o.sendMethod = JSON.parse(o.sendMethod)
      }catch(e) {
        o.sendMethod = o.sendMethod
      }
    });

    config.controls = JSON.parse(JSON.stringify(config.controls));
    const {newControls,newValue} = handleControls(JSON.parse(JSON.stringify( config.controls )),config.theMe,data.messageTitleConfigId,{...data});
    editControls = newControls;
    editValue = newValue
  }


  const props =  {
    edit:edit,
    tableItems:item,
    fromArchives:config.fromArchives,
    theMe:config.theMe,
    buttons:config.buttons,
    tableCols:config.tableCols,
    config: config.config,
    controls: editControls ? editControls:config.controls,
    title: edit ? config.edit : config.add,
    value: editValue ? editValue :data,
    size: 'middle',
    okFunc,
  };
  showDialog(createContainer, props);
};

export default showDiaLog;
