import { connect } from 'react-redux';
import OrderInfoPage from './OrderInfoPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import {fetchJson, getJsonResult} from "../../../../common/common";
import {fetchAllDictionary, setDictionary2} from "../../../../common/dictionary";
import helper from "../../../../common/common";

/**
 * 功能：生成一个运单基本信息页面容器组件
 * 参数：action - [必需] 由此容器组件所在位置对应的reducer路径生成
 *       getSelfState - [必需] 获取容器组件在state对应路径下的自身节点状态
 * 返回：运单编辑页面容器组件
 * 初始化状态initState：{
 *     id - 运单标识，新增时为空
 *     readonly - true为页面只读
 *     closeFunc - 页面为tab页且存在按钮操作时，操作完成后的关闭页面回调函数，无按钮操作时可无
 * }
 */
const createOrderInfoPageContainer = (action, getSelfState) => {

  const getRouteKey = () => {
    const url = window.location.href;
    const index = url.lastIndexOf('/');
    if (index !== -1) {
      return url.substring(index+1);
    }
  };

  const getCurrentDate = () => {
    const date = new Date;
    const d = date.getDate();
    const dd = d < 10 ? `0${d}` : String(d);
    const m = date.getMonth()+1;
    const mm = m < 10 ? `0${m}` : String(m);
    const yyyy = date.getFullYear().toString();
    const h = date.getHours();
    const hh = h < 10 ? `0${h}` : String(h);
    const f = date.getMinutes();
    const ff = f < 10 ? `0${d}` : String(d);
    const s = date.getSeconds();
    const ss = s < 10 ? `0${d}` : String(d);
    return `${yyyy}-${mm}-${dd} ${hh}:${ff}:${ss}`;
  };

  const buildState = async ({id, readonly, closeFunc}) => {
    try {
      //获取并完善config
      let url = '/api/order/input/orderInfoConfig';
      const config = getJsonResult(await fetchJson(url));
      const dic = getJsonResult(await fetchAllDictionary());
      Object.keys(config.formSections).map(key => {
        setDictionary2(dic, config.formSections[key].controls);
      });
      setDictionary2(dic, config.addressTable.cols, config.goodsTable.cols);
      //获取订单数据
      let data = {baseInfo:{customerDelegateTime: getCurrentDate()}, addressList:[{},{}], goodsList:[]};
      if (id) {
        url = `/api/order/input/info/${id}`;
        const {addressList=[], goodsList=[], ...baseInfo} = getJsonResult(await fetchJson(url));
        data = {
          baseInfo,
          addressList: addressList,
          goodsList: goodsList
        };
      }
      return {
        ...config,
        ...data,
        readonly,
        closeFunc,
        valid:{},
        status: 'page'
      };
    } catch (e) {
      helper.showError(e.message);
    }
  };

  const initActionCreator = () => async (dispatch, getState) => {
    const initState = getSelfState(getState()) || {};
    dispatch(action.assign({status: 'loading'}));
    const state = await buildState(initState);
    if (!state) {
      dispatch(action.create({...initState, status: 'retry'}));
    }else {
      dispatch(action.create(state));
    }
  };

  const changeActionCreator = (key, value) => async (dispatch, getState) => {
    const {baseInfo} = getSelfState(getState());
    const oldValue = baseInfo[key];
    let obj = {[key]: value};
    let url, data;
    switch (key) {
      case 'customerId': {
        obj.contactName = '';
        obj.contactTelephone = '';
        obj.contactEmail = '';
        obj.salespersonId = '';
        obj.customerServiceId = '';
        if(value.value) {
          if (oldValue && oldValue.value === value.value) return;
          //获取客服
          if (baseInfo.businessType) {
            url = `/api/order/input/customer_service_info/${value.value}/${baseInfo.businessType}`;
            data = await helper.fetchJson(url);
            if (data.returnCode === 0) {
              obj.customerServiceId = data.result || '';
            }
          }
          //获取默认联系人信息
          url = `/api/order/input/customer_default_contact/${value.value}`;
          data = await helper.fetchJson(url);
          if (data.returnCode === 0 && data.result.id) {
            obj.contactName = {title: data.result.contactName, value: data.result.id};
            obj.contactTelephone = data.result.contactMobile || '';
            obj.contactEmail = data.result.contactEmail || '';
          }
          //获取客户信息带出销售人员
          url = `/api/order/input/customer_info/${value.value}`;
          data = await helper.fetchJson(url);
          if (data.returnCode === 0) {
            obj.salespersonId = data.result.salesPersonId || '';
          }
        }
        //清空收发货地址和货物明细以及其联动的基本信息
        dispatch(action.assign({addressList:[{}, {}], goodsList:[]}));
        dispatch(action.assign({departure:'', destination:'', goodsNumber:'', isSupervisor:'', route:''}));
        break;
      }
      case 'contactName': {
        obj.contactTelephone = '';
        obj.contactEmail = '';
        if(value.value) {
          if (oldValue && oldValue.value === value.value) return;
          url = `/api/order/input/customer_contact_info/${value.value}`;
          data = await helper.fetchJson(url);
          if (data.returnCode === 0) {
            obj.contactTelephone = data.result.contactMobile || '';
            obj.contactEmail = data.result.contactEmail || '';
          }
        }
        break;
      }
      case 'businessType': {
        obj.customerServiceId = '';
        if(value) {
          if (oldValue && oldValue === value) return;
          if (baseInfo.customerId) {
            url = `/api/order/input/customer_service_info/${baseInfo.customerId.value}/${value}`;
            data = await helper.fetchJson(url);
            if (data.returnCode === 0) {
              obj.customerServiceId = data.result || '';
            }
          }
        }
        break;
      }
    }
    dispatch(action.assign(obj, 'baseInfo'));
  };

  const searchActionCreator = (formKey, key, value) => async (dispatch, getState) => {
    let url, data, options;
    switch (key) {
      case 'customerId': {
        url = `/api/config/customer_contact/customer`;
        data = await helper.fetchJson(url, helper.postOption({maxNumber: 10, filter: value}));
        break;
      }
      case 'contactName': {
        const {baseInfo} = getSelfState(getState());
        url = `/api/order/input/customer_contacts/${baseInfo.customerId.value}`;
        data = await helper.fetchJson(url, 'post');
        break;
      }
      case 'carModeId': {
        url = `/api/order/input/car_mode_drop_list`;
        data = await helper.fetchJson(url, helper.postOption({maxNumber: 10, carMode: value, active: 'active_activated'}));
        break;
      }
      default:
        return;
    }
    if (data.returnCode !== 0) {
      return;
    }
    options =data.result instanceof Array? data.result:data.result.data;
    dispatch(action.update({options}, ['formSections', formKey, 'controls'], {key:'key', value:key}));
  };

  const formAddActionCreator = (key) => (dispatch, getState) => {
  };

  //计算表格数据变化后联动到基本信息的数据
  const countBaseInfoData = async (list=[], changeKey) => {
    let obj = {goodsNumber: 0, isSupervisor:'', route:''};
    list.map(({deliveryGoodsNumber, isSupervisor, consigneeConsignorShortName}) => {
      consigneeConsignorShortName && (obj.route = obj.route + `${consigneeConsignorShortName}; `);
      obj.isSupervisor === '' && isSupervisor === '1' && (obj.isSupervisor = isSupervisor);
      obj.goodsNumber += Number(deliveryGoodsNumber || 0);
    });
    obj.isSupervisor === '' && (obj.isSupervisor = '0');
    if (['consigneeConsignorId', 'pickupDeliveryType'].includes(changeKey)) {
      obj.departure = '';
      obj.destination = '';
      const consignorList = list.filter(item => item.pickupDeliveryType === '0' || item.pickupDeliveryType === '2');
      const consigneeList = list.filter(item => item.pickupDeliveryType === '1' || item.pickupDeliveryType === '2');
      let firstConsignorId = '', lastConsigneeId = '', data;
      const url = '/api/order/input/customer_factory_info';
      if (consignorList.length) {
        firstConsignorId = consignorList[0].consigneeConsignorId;
        if (firstConsignorId) {
          data = await helper.fetchJson(`${url}/${firstConsignorId.value}`);
          if (data.returnCode === 0) {
            obj.departure = data.result.chargingPlaceId;
          }
        }
      }
      if (consigneeList.length) {
        lastConsigneeId = consigneeList[consigneeList.length-1].consigneeConsignorId;
        if (lastConsigneeId) {
          data = await helper.fetchJson(`${url}/${lastConsigneeId.value}`);
          if (data.returnCode === 0) {
            obj.destination = data.result.chargingPlaceId;
          }
        }
      }
    }
    return obj;
  };

  const contentChangeActionCreator = (tableKey, rowIndex, keyName, value) => async (dispatch, getState) => {
    if (tableKey === 'addressList') {
      let data, url, obj;
      if (keyName === 'consigneeConsignorId') {
        obj = {[keyName]: value, consigneeConsignorCode:'', consigneeConsignorShortName:'', contactName:'', contactTelephone:'', contactEmail:'', consigneeConsignorAddress:''};
        if (value) {
          url = `/api/order/input/customer_factory_info/${value.value}`;
          data = await helper.fetchJson(url);
          if (data.returnCode === 0) {
            const {name, shortName, code, address, customerFactoryContactList} = data.result || {};
            obj.consigneeConsignorCode = code || '';
            obj.consigneeConsignorShortName = shortName || name;
            obj.consigneeConsignorAddress = address || '';
            if (customerFactoryContactList.length === 1) {
              const {contactName, contactTelephone, contactEmail} = customerFactoryContactList[0];
              obj.contactName = contactName || '';
              obj.contactTelephone = contactTelephone || '';
              obj.contactEmail = contactEmail || '';
            }
          }
        }
        dispatch(action.update(obj, tableKey, rowIndex));
      }else if (keyName === 'contactName') {
        if (value) {
          dispatch(action.update({[keyName]: value, ...JSON.parse(value.value)}, tableKey, rowIndex));
        }else {
          dispatch(action.update({[keyName]: value, contactTelephone:'', contactEmail:''}, tableKey, rowIndex));
        }
      }else {
        dispatch(action.update({[keyName]: value}, tableKey, rowIndex));
      }
      //表格联动更新表单数据
      const {addressList} = getSelfState(getState());
      dispatch(action.assign(await countBaseInfoData(addressList, keyName), 'baseInfo'));
    }else {
      dispatch(action.update({[keyName]: value}, tableKey, rowIndex));
    }
  };

  const contentSearchActionCreator = (tableKey, rowIndex, keyName, value) => async (dispatch, getState) => {
    const {addressList, baseInfo} = getSelfState(getState());
    if (!baseInfo.customerId) {
      const path = tableKey === addressList ? 'addressTable' : 'goodsTable';
      dispatch(action.update({options:[]}, [path, 'cols'], {key: 'key', value: keyName}));
      return;
    }
    if (tableKey === 'addressList') {
      let data, url;
      if (keyName === 'consigneeConsignorId') {
        url = `/api/order/input/customer_factory_drop_list`;
        data = await helper.fetchJson(url, helper.postOption({customerId: baseInfo.customerId.value, name: value}));
        if (data.returnCode === 0) {
          dispatch(action.update({options: data.result}, ['addressTable', 'cols'], {key: 'key', value: keyName}));
        }
      }else if (keyName === 'contactName') {
        if (!addressList[rowIndex].consigneeConsignorId) {
          dispatch(action.update({options: []}, ['addressTable', 'cols'], {key: 'key', value: keyName}));
          return;
        }
        url = `/api/order/input/customer_factory_info/${addressList[rowIndex].consigneeConsignorId.value}`;
        data = await helper.fetchJson(url);
        if (data.returnCode === 0) {
          const options = data.result.customerFactoryContactList.map(item => {
            const newValue = {contactTelephone: item.contactTelephone, contactEmail: item.contactEmail || ''};
            return {title: item.contactName, value: JSON.stringify(newValue)};
          });
          dispatch(action.update({options}, ['addressTable', 'cols'], {key: 'key', value: keyName}));
        }
      }
    }else if (tableKey === 'goodsList') {
      const options = [];
      const ids = [];
      addressList.map(item => {
        if (item.consigneeConsignorId && !ids.includes(item.consigneeConsignorId.value)){
          options.push(item.consigneeConsignorId);
          ids.push(item.consigneeConsignorId.value);
        }
      });
      dispatch(action.update({options}, ['goodsTable', 'cols'], {key: 'key', value: keyName}));
    }
  };

  const checkActionCreator = (tableKey, rowIndex, keyName, checked) => (dispatch) => {
    dispatch(action.update({[keyName]: checked}, tableKey, rowIndex));
  };

  const tabChangeActionCreator = (activeKey) => (dispatch, getState) => {
    dispatch(action.assign({activeKey}));
  };

  const exitValidActionCreator = (key) => {
    return action.assign({[key]: false}, 'valid');
  };

  //提取运单保存/提交的数据
  const getSaveData = ({baseInfo, addressList, goodsList}) => {
    return {
      ...helper.convert(baseInfo),
      contactName: baseInfo.contactName ? baseInfo.contactName.title : '',
      addressList: addressList.map(item => ({...helper.convert(item), contactName: item.contactName ? item.contactName.title : ''})),
      goodsList: goodsList.map(item => helper.convert(item))
    };
  };

  //保存（不关闭当前页）
  const saveActionCreator = async (dispatch, getState) => {
    const selfState = getSelfState(getState());
    const {baseInfo} = selfState;
    if (!baseInfo.customerId) return helper.showError('请先填写客户');
    const body = getSaveData(selfState);
    const method = baseInfo.id ? 'put' : 'post';
    const {returnCode, returnMsg, result} = await helper.fetchJson(`/api/order/input`, helper.postOption(body, method));
    if (returnCode !== 0) return helper.showError(returnMsg);
    helper.showSuccessMsg('保存成功');
    if (!baseInfo.id) { //新增保存处理
      dispatch(action.assign({id: result}, 'baseInfo'));
      dispatch(action.update({type: 'readonly'}, ['formSections', 'baseInfo', 'controls'], {key: 'key', value: 'customerId'}));
    }
  };

  //校验数据
  const checkData = ({addressTable, goodsTable, formSections, baseInfo, addressList, goodsList}, dispatch) => {
    for (let key of Object.keys(formSections)) {
      if (!helper.validValue(formSections[key].controls, baseInfo)) {
        dispatch(action.assign({[key]: true}, 'valid'));
        return false;
      }
    }
    if (!helper.validArray(addressTable.cols, addressList)) {
      dispatch(action.assign({activeKey: 'addressList'}));
      dispatch(action.assign({addressList: true}, 'valid'));
      return false;
    }
    if (!helper.validArray(goodsTable.cols, goodsList)) {
      dispatch(action.assign({activeKey: 'goodsList'}));
      dispatch(action.assign({goodsList: true}, 'valid'));
      return false;
    }
    return true;
  };

  //提交
  const commitActionCreator = async (dispatch, getState) => {
    const selfState = getSelfState(getState());
    const {baseInfo, closeFunc} = selfState;
    //校验数据
    if (!checkData(selfState, dispatch)) return;
    const body = getSaveData(selfState);
    const method = baseInfo.id ? 'put' : 'post';
    const {returnCode, returnMsg} = await helper.fetchJson(`/api/order/input/commit`, helper.postOption(body, method));
    if (returnCode !== 0) return helper.showError(returnMsg);
    helper.showSuccessMsg('提交成功');
    if (getRouteKey() === 'input') {
      newActionCreator(dispatch);
    }
    closeFunc && closeFunc();
  };

  //增加收发货地址
  const addActionCreator = async (dispatch) => {
    dispatch(action.add({}, 'addressList'));
  };

  //删除收发货地址
  const delActionCreator = async (dispatch, getState) => {
    const {addressList, goodsList} = getSelfState(getState());
    const usedIds = [];
    goodsList.map(item => {
      item.consignorId && usedIds.push(item.consignorId.value);
      item.consigneeId && usedIds.push(item.consigneeId.value);
    });
    if (!addressList.filter(item => item.checked === true && item.consigneeConsignorId).every(item => !usedIds.includes(item.consigneeConsignorId.value))) {
     return helper.showError('勾选记录中有收发货人已被货物明细中使用，无法删除');
    }
    let newList = addressList.filter(item => item.checked !== true);
    if (newList.length === 0) {
      newList = [{}, {}];
    }else if (newList.length === 1) {
      newList.push({});
    }
    dispatch(action.assign({addressList: newList}));
    dispatch(action.assign( await countBaseInfoData(newList, 'consigneeConsignorId'), 'baseInfo'));
  };

  //上移
  const upActionCreator = async (dispatch, getState) => {
    const {addressList:tableItems} = getSelfState(getState());
    let checkIndex = -1;
    const checkItems = tableItems.filter((item, index) => {
      if (item.checked === true) {
        checkIndex = index;
        return true;
      }
      return false;
    });
    if (checkItems.length !== 1) {
      helper.showError('请勾选一条记录');
      return;
    }
    if (checkIndex === 0) return;
    const checkedItem = checkItems.pop();
    let items = [...tableItems];
    items[checkIndex] = items[checkIndex-1];
    items[checkIndex-1] = checkedItem;
    dispatch(action.assign({addressList: items}));
    dispatch(action.assign( await countBaseInfoData(items, 'consigneeConsignorId'), 'baseInfo'));
  };

  //下移
  const passActionCreator = async (dispatch, getState) => {
    const {addressList:tableItems} = getSelfState(getState());
    let checkIndex = -1;
    const checkItems = tableItems.filter((item, index) => {
      if (item.checked === true) {
        checkIndex = index;
        return true;
      }
      return false;
    });
    if (checkItems.length !== 1) {
      helper.showError('请勾选一条记录');
      return;
    }
    if (checkIndex === tableItems.length-1) return;
    const checkedItem = checkItems.pop();
    let items = [...tableItems];
    items[checkIndex] = items[checkIndex+1];
    items[checkIndex+1] = checkedItem;
    dispatch(action.assign({addressList: items}));
    dispatch(action.assign( await countBaseInfoData(items, 'consigneeConsignorId'), 'baseInfo'));
  };

  //新增货物明细
  const addGoodsActionCreator = (dispatch) => {
    dispatch(action.add({}, 'goodsList'));
  };

  //删除货物明细
  const delGoodsActionCreator = async (dispatch, getState) => {
    const {goodsList} = getSelfState(getState());
    let newList = goodsList.filter(item => item.checked !== true);
    dispatch(action.assign({goodsList: newList}));
  };

  //下一单
  const newActionCreator = (dispatch) => {
    dispatch(action.assign({
      baseInfo: {customerDelegateTime: getCurrentDate()},
      addressList:[{},{}],
      goodsList:[],
      activeKey: 'addressList'
    }));
    dispatch(action.update({type: 'search'}, ['formSections', 'baseInfo', 'controls'], {key: 'key', value: 'customerId'}));
  };

  const buttons = {
    add: addActionCreator,
    del: delActionCreator,
    up: upActionCreator,
    down: passActionCreator,
    addGoods: addGoodsActionCreator,
    delGoods: delGoodsActionCreator,
    save: saveActionCreator,
    commit: commitActionCreator,
    new: newActionCreator,
  };

  const clickActionCreator = (key) => {
    if (buttons[key]) {
      return buttons[key];
    } else {
      console.log('unknown key:', key);
      return {type: 'unknown'};
    }
  };

  const mapStateToProps = (state) => {
    return getSelfState(state);
  };

  const actionCreators = {
    onInit: initActionCreator,
    onChange: changeActionCreator,
    onSearch: searchActionCreator,
    onAdd: formAddActionCreator,
    onContentChange: contentChangeActionCreator,
    onContentSearch: contentSearchActionCreator,
    onExitValid: exitValidActionCreator,
    onCheck: checkActionCreator,
    onTabChange: tabChangeActionCreator,
    onClick: clickActionCreator,
  };

  return connect(mapStateToProps, actionCreators)(EnhanceLoading(OrderInfoPage));
};

export default createOrderInfoPageContainer;
