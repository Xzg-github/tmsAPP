import { connect } from 'react-redux';
import OrderInfoPage from './OrderInfoPage';
import {EnhanceLoading} from '../../../../components/Enhance';
import execWithLoading from '../../../../standard-business/execWithLoading';
import {fetchJson, getJsonResult} from "../../../../common/common";
import {fetchAllDictionary, setDictionary2} from "../../../../common/dictionary";
import moment from 'moment';
import helper from "../../../../common/common";
import { showAddCustomerFactoryDialog } from '../../../config/customerFactory/EditDialogContainer';
import showAddCustomerContactDialog from '../../../config/customerContact/EditDialogContainer';
import {getDistance} from '../../../../components/ElectricFence/Map';

/**
 * 功能：生成一个运单基本信息页面容器组件
 * 参数：action - [必需] 由此容器组件所在位置对应的reducer路径生成
 *       getSelfState - [必需] 获取容器组件在state对应路径下的自身节点状态
 * 返回：运单编辑页面容器组件
 * 初始化状态initState：{
 *     id - 运单标识，新增时为空
 *     isAppend - true为补录运单，默认false，为false且id不为空时跟据运单数据自动设置
 *     readonly - true为页面只读
 *     closeFunc - 页面为tab页且存在按钮操作时，操作完成后的关闭页面回调函数，无按钮操作时可无
 *     pageType - 页面类型：1 - 仅运单信息  2 - 有运单信息和在途信息，默认新增运单or补录运单为1，编辑或查看非补录运单为2
 * }
 */
const createOrderInfoPageContainer = (action, getSelfState) => {

  const buildState = async ({id, readonly, closeFunc, pageType, isAppend = false}) => {
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
      let data = {baseInfo:{customerDelegateTime: moment().format('YYYY-MM-DD HH:mm:ss')}, addressList:[{pickupDeliveryType: '0'},{pickupDeliveryType: '1'}], goodsList:[]};
      if (id) {
        url = `/api/order/input/info/${id}`;
        const {addressList=[], goodsList=[], ...baseInfo} = getJsonResult(await fetchJson(url));
        data = {
          baseInfo: {
            ...baseInfo,
            taskTypeCode: baseInfo.taskTypeCode ? baseInfo.taskTypeCode.split(',') : '',
            carInfoId: baseInfo.carInfoId ? {value: baseInfo.carInfoId, title: baseInfo.carNumber} : '',
            driverId: baseInfo.driverId ? {value: baseInfo.driverId, title: baseInfo.driverName}: '',
          },
          addressList: addressList.map(item => item.consigneeConsignorId ? {...item, consigneeConsignorId: {value: item.consigneeConsignorId, title: item.consigneeConsignorName}} : item),
          goodsList: goodsList
        };
        isAppend = !!baseInfo.supplementType; //设置是否为补录运单
        config.formSections.baseInfo.controls = config.formSections.baseInfo.controls.map(item => item.key === 'customerId' ? {...item, type: 'readonly'} : item);
        isAppend && (config.formSections.dispatchInfo.controls = config.formSections.dispatchInfo.controls.map(item => item.key === 'taskTypeCode' ? {...item, key: 'taskTypeName'} : item));
      }
      !isAppend && delete config.formSections.dispatchInfo; //非补录运单无派车信息组
      let buttons = [...config.buttons];
      if (helper.getRouteKey() === 'complete') {
        buttons = buttons.filter(item => item.key === 'save');
      }
      return {
        ...config,
        ...data,
        buttons,
        readonly,
        isAppend,
        closeFunc,
        pageType: pageType || (id && !isAppend) ? 2 : 1,
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
      if (helper.getRouteKey() === 'input') {
        let [...pageTitle] = helper.getPageTitle();
        pageTitle.push('新增');
        helper.setPageTitle(pageTitle);
      }
    }
  };

  const customerIdChange = (key, value) => async (dispatch, getState) => {
    const {baseInfo} = getSelfState(getState());
    const oldValue = baseInfo[key];
    let obj = {[key]: value, contactName: '', contactTelephone: '', contactEmail:'', salespersonId: '', customerServiceId: '',
      departure:'', destination:'', goodsNumber:'', isSupervisor:'', route:'', totalMileage:''};
    let url, data;
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
    dispatch(action.assign({addressList:[{pickupDeliveryType: '0'}, {pickupDeliveryType: '1'}], goodsList:[]}));
    dispatch(action.assign(obj, 'baseInfo'));
  };

  const contactNameChange = (key, value) => async (dispatch, getState) => {
    const {baseInfo} = getSelfState(getState());
    const oldValue = baseInfo[key];
    let obj = {[key]: value, contactTelephone: '', contactEmail: ''};
    if(value.value) {
      if (oldValue && oldValue.value === value.value) return;
      const url = `/api/order/input/customer_contact_info/${value.value}`;
      const data = await helper.fetchJson(url);
      if (data.returnCode === 0) {
        obj.contactTelephone = data.result.contactMobile || '';
        obj.contactEmail = data.result.contactEmail || '';
      }
    }
    dispatch(action.assign(obj, 'baseInfo'));
  };

  const businessTypeChange = (key, value) => async (dispatch, getState) => {
    const {baseInfo} = getSelfState(getState());
    const oldValue = baseInfo[key];
    let obj = {[key]: value, customerServiceId: ''};
    if(value) {
      if (oldValue && oldValue === value) return;
      if (baseInfo.customerId) {
        const url = `/api/order/input/customer_service_info/${baseInfo.customerId.value}/${value}`;
        const data = await helper.fetchJson(url);
        if (data.returnCode === 0) {
          obj.customerServiceId = data.result || '';
        }
      }
    }
    dispatch(action.assign(obj, 'baseInfo'));
  };

  const carInfoIdChange = (key, value) => async (dispatch, getState) => {
    const {baseInfo} = getSelfState(getState());
    const oldValue = baseInfo[key];
    let obj = {[key]: value, ownerCarTag: '', supplierId:'', driverId:'', driverMobilePhone:''};
    let url, data;
    if(value.value) {
      if (oldValue && oldValue.value === value.value) return;
      url = `/api/dispatch/done/car_info/${value.value}`;
      data = await helper.fetchJson(url);
      if (data.returnCode === 0) {
        obj.ownerCarTag = data.result.isOwner;
        obj.supplierId = data.result.supplierId;
        obj.driverId = data.result.driverId;
      }
      if (obj.driverId) {
        url = `/api/dispatch/done/driver_info/${obj.driverId.value}`;
        data = await helper.fetchJson(url);
        if (data.returnCode === 0) {
          obj.driverMobilePhone = data.result.driverMobilePhone;
        }
      }
    }
    dispatch(action.assign(obj, 'baseInfo'));
  };

  const driverIdChange = (key, value) => async (dispatch, getState) => {
    const {baseInfo} = getSelfState(getState());
    const oldValue = baseInfo[key];
    let obj = {[key]: value, driverMobilePhone:''};
    let url, data;
    if(value.value) {
    if (oldValue && oldValue.value === value.value) return;
      url = `/api/dispatch/done/driver_info/${obj.driverId.value}`;
      data = await helper.fetchJson(url);
      if (data.returnCode === 0) {
        obj.driverMobilePhone = data.result.driverMobilePhone;
      }
    }
    dispatch(action.assign(obj, 'baseInfo'));
  };

  const taskTypeCodeChange = (key, value) => (dispatch, getState) => {
    const {formSections} = getSelfState(getState());
    const {options= []} = formSections.dispatchInfo.controls.filter(item => item.key === 'taskTypeCode').pop() || {};
    let obj = {[key]: value};
    if (value && Array.isArray(value)) {
      obj.taskTypeName = '';
      value.map((item, index) => {
        const {title=''} = options.filter(option => option.value === item).pop() || {};
        obj.taskTypeName += index === value.length-1 ? `${title}` : `${title},`;
      });
    }
    dispatch(action.assign(obj, 'baseInfo'));
  };

  const changeKeys = {
    customerId: customerIdChange,
    contactName: contactNameChange,
    businessType: businessTypeChange,
    carInfoId: carInfoIdChange,
    driverId: driverIdChange,
    taskTypeCode: taskTypeCodeChange,
  };

  const changeActionCreator = (key, value) => {
    if (changeKeys[key]) {
      return changeKeys[key](key, value);
    } else {
      return action.assign({[key]: value}, 'baseInfo');
    }
  };

  const searchActionCreator = (formKey, key, value, config) => async (dispatch, getState) => {
    const {baseInfo} = getSelfState(getState());
    let filter = value;
    if (key === 'contactName') {
      if (!baseInfo.customerId) return;
      filter = baseInfo.customerId.value;
    }
    else if (key === 'driverId') {
      if (!baseInfo.supplierId) return;
      filter = `${baseInfo.supplierId.value}&isOwner=${baseInfo.ownerCarTag}&driverName=${value}`;
    }
    const {returnCode, result} = await helper.fuzzySearchEx(filter, config);
    let options = returnCode === 0 ? result : undefined;
    dispatch(action.update({options}, ['formSections', formKey, 'controls'], {key: 'key', value: key}));
  };

  const formAddActionCreator = (key) => async (dispatch, getState) => {
    const {baseInfo} = getSelfState(getState());
    if (!baseInfo.customerId) return helper.showError('请先填写客户');
    if (key === 'contactName') {
      return showAddCustomerContactDialog(undefined, {customerId: baseInfo.customerId}, true);
    }else if (key === 'consigneeConsignorId') {
      return showAddCustomerFactoryDialog(undefined, {customerId: baseInfo.customerId});
    }
  };

  //计算表格数据变化后联动到基本信息的数据
  const countBaseInfoData = async (list=[], changeKey) => {
    let obj = {goodsNumber: 0, isSupervisor:'', route:''};
    list.map(({deliveryGoodsNumber, isSupervisor, consigneeConsignorShortName}, index) => {
      const newNode = index === list.length-1 ? consigneeConsignorShortName : `${consigneeConsignorShortName}->`;
      consigneeConsignorShortName && (obj.route = obj.route + newNode);
      obj.isSupervisor === '' && isSupervisor === '1' && (obj.isSupervisor = isSupervisor);
      obj.goodsNumber += Number(deliveryGoodsNumber || 0);
    });
    obj.goodsNumber = obj.goodsNumber.toFixed(2);
    obj.isSupervisor === '' && (obj.isSupervisor = '0');
    if (['consigneeConsignorId', 'pickupDeliveryType'].includes(changeKey)) {
      obj.departure = '';
      obj.destination = '';
      const consignorList = list.filter(item => (item.pickupDeliveryType !== '' && item.pickupDeliveryType !== undefined) && (Number(item.pickupDeliveryType) === 0 || Number(item.pickupDeliveryType) === 2));
      const consigneeList = list.filter(item => (item.pickupDeliveryType !== '' && item.pickupDeliveryType !== undefined) && (Number(item.pickupDeliveryType) === 1 || Number(item.pickupDeliveryType) === 2));
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
    if (changeKey === 'consigneeConsignorId') {
      obj.totalMileage = '';
    }
    return obj;
  };

  const contentChangeActionCreator = (tableKey, rowIndex, keyName, value) => async (dispatch, getState) => {
    if (tableKey === 'addressList') {
      let data, url, obj;
      if (keyName === 'consigneeConsignorId') {
        obj = {[keyName]: value, consigneeConsignorCode:'', consigneeConsignorShortName:'', contactName:'', contactTelephone:'', contactEmail:'', consigneeConsignorAddress:'', longitude:'', latitude:''};
        if (value) {
          url = `/api/order/input/customer_factory_info/${value.value}`;
          data = await helper.fetchJson(url);
          if (data.returnCode === 0) {
            const {name, shortName, code, address, customerFactoryContactList, longitude, latitude} = data.result || {};
            obj.consigneeConsignorCode = code || '';
            obj.consigneeConsignorShortName = shortName || name;
            obj.consigneeConsignorAddress = address || '';
            obj.longitude = longitude || '';
            obj.latitude = latitude || '';
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
          let options = data.result || [];
          const existValueIds = addressList.map(item => item[keyName] ? item[keyName].value : '');
          options = options.filter(item => !existValueIds.includes(item.value));
          dispatch(action.update({options}, ['addressTable', 'cols'], {key: 'key', value: keyName}));
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
    }
  };

  const checkActionCreator = (tableKey, rowIndex, keyName, checked) => (dispatch) => {
    dispatch(action.update({[keyName]: checked}, tableKey, rowIndex));
  };

  const tabChangeActionCreator = (activeKey) => (dispatch, getState) => {
    dispatch(action.assign({activeKey}));
    if (activeKey === 'goodsList') {
      const {addressList} = getSelfState(getState());
      const options = [];
      const ids = [];
      addressList.map(item => {
        if (item.consigneeConsignorId && !ids.includes(item.consigneeConsignorId.value)){
          options.push(item.consigneeConsignorId);
          ids.push(item.consigneeConsignorId.value);
        }
      });
      dispatch(action.update({options}, ['goodsTable', 'cols'], {key: 'key', value: 'consignorId'}));
      dispatch(action.update({options}, ['goodsTable', 'cols'], {key: 'key', value: 'consigneeId'}));
    }
  };

  const exitValidActionCreator = (key) => {
    return action.assign({[key]: false}, 'valid');
  };

  //提取运单保存/提交的数据
  const getSaveData = ({baseInfo, addressList, goodsList}) => {
    return {
      ...helper.convert(baseInfo),
      contactName: baseInfo.contactName && typeof baseInfo.contactName === 'object' ? baseInfo.contactName.title : baseInfo.contactName,
      carNumber: baseInfo.carInfoId ? baseInfo.carInfoId.title : '',
      driverName: baseInfo.driverId ? baseInfo.driverId.title : '',
      taskTypeCode: baseInfo.taskTypeCode ? baseInfo.taskTypeCode.join(',') : '',
      addressList: addressList.map((item, index) => ({
        ...helper.convert(item),
        consigneeConsignorName: item.consigneeConsignorId ? item.consigneeConsignorId.title : '',
        contactName: item.contactName && typeof item.contactName === 'object' ? item.contactName.title : item.contactName,
        sequence: index
      })),
      goodsList: goodsList.map(item => helper.convert(item))
    };
  };

  //保存（不关闭当前页）
  const saveActionCreator = async (dispatch, getState) => {
    await countActionCreator(dispatch, getState);
    const selfState = getSelfState(getState());
    const {baseInfo, isAppend} = selfState;
    if (!baseInfo.customerId) return helper.showError('请先填写客户');
    const body = getSaveData(selfState);
    const method = baseInfo.id ? 'put' : 'post';
    let url = helper.getRouteKey() === 'input' ? '/api/order/input' : '/api/order/complete/change';
    if (selfState.isAppend) {
      url = '/api/bill/append';
    }
    const {returnCode, returnMsg, result} = await helper.fetchJson(url, helper.postOption(body, method));
    if (returnCode !== 0) return helper.showError(returnMsg);
    if (!baseInfo.id) { //新增保存处理
      if (isAppend) { //新增补录运单
        helper.showSuccessMsg('保存成功');
        dispatch(action.assign({id: result.id}, 'baseInfo'));
        dispatch(action.update({type: 'readonly'}, ['formSections', 'baseInfo', 'controls'], {key: 'key', value: 'customerId'}));
      }else { //新增运单
        helper.showSuccessMsg(`运单号：${result.orderNumber} 运单已保存至待办任务-待完善`);
        return newActionCreator(dispatch, getState);
      }
    }else {
      helper.showSuccessMsg('保存成功');
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
    await countActionCreator(dispatch, getState);
    const selfState = getSelfState(getState());
    const {baseInfo, closeFunc, isAppend} = selfState;
    //校验数据
    if (!checkData(selfState, dispatch)) return;
    const body = getSaveData(selfState);
    const method = baseInfo.id ? 'put' : 'post';
    const url = isAppend ? '/api/bill/append/commit' : '/api/order/input/commit';
    const {returnCode, returnMsg, result} = await helper.fetchJson(url, helper.postOption(body, method));
    if (returnCode !== 0) return helper.showError(returnMsg);
    if (helper.getRouteKey() === 'input') {
      helper.showSuccessMsg(`运单号：${result.orderNumber} 运单已提交至待办任务-待派发`);
      newActionCreator(dispatch, getState);
    }else {
      helper.showSuccessMsg('提交成功');
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
      item.consignorId && usedIds.push(item.consignorId);
      item.consigneeId && usedIds.push(item.consigneeId);
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

  //获取总里程数
  const getTotalMileage = async (getState) => {
    const {addressList} = getSelfState(getState());
    const points = addressList.filter(item => item.latitude && item.longitude).map(({longitude, latitude}) => {
      return `${latitude},${longitude}`;
    });
    const distance = await getDistance(points) || '';
    if (!distance){
      helper.showError(`计算总里程失败`);
    }
    return distance;
  };

  //计算总里程
  const countActionCreator = async (dispatch, getState) => {
    const totalMileage = await getTotalMileage(getState) || '';
    dispatch(action.assign({totalMileage}, 'baseInfo'));
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
  const newActionCreator = (dispatch, getState) => {
    dispatch(action.assign({
      baseInfo: {customerDelegateTime: moment().format('YYYY-MM-DD HH:mm:ss')},
      addressList:[{pickupDeliveryType: '0'}, {pickupDeliveryType: '1'}],
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
    count: countActionCreator,
    addGoods: addGoodsActionCreator,
    delGoods: delGoodsActionCreator,
    save: saveActionCreator,
    commit: commitActionCreator,
  };

  const clickActionCreator = (key) => {
    if (buttons[key]) {
      return buttons[key];
    } else {
      console.log('unknown key:', key);
      return {type: 'unknown'};
    }
  };

  const topTabChangeActionCreator = (topActiveKey) => async (dispatch, getState) => {
    dispatch(action.assign({topActiveKey}));
    const {baseInfo, pageType, trackLoaded = false} = getSelfState(getState());
    if (topActiveKey === 'track' && pageType === 2 && !trackLoaded) { //加载在途信息数据
      execWithLoading(async () => {
        let isOk = true;
        let data = await helper.fetchJson(`/api/order/input/track_status/${baseInfo.id}`);
        if (data.returnCode !== 0) {
          helper.showError(`加载运单状态失败：${data.returnMsg}`);
          isOk = false;
        }else {
          dispatch(action.assign({statusList: data.result}, ['section1']));
        }

        data = await helper.fetchJson(`/api/order/input/track_cars/${baseInfo.id}`);
        if (data.returnCode !== 0) {
          helper.showError(`加载车辆信息败：${data.returnMsg}`);
          isOk = false;
        }else {
          dispatch(action.assign({carInfo: data.result}, ['section2']));
        }

        data = await helper.fetchJson(`/api/order/input/track_driver/${baseInfo.id}`);
        if (data.returnCode !== 0) {
          helper.showError(`加载司机任务失败：${data.returnMsg}`);
          isOk = false;
        }else {
          dispatch(action.assign({taskList: data.result}, ['section3']));
        }

        data = await helper.fetchJson(`/api/order/input/track_change/${baseInfo.id}`);
        if (data.returnCode !== 0) {
          helper.showError(`加载更改记录失败：${data.returnMsg}`);
          isOk = false;
        }else {
          dispatch(action.assign({items: data.result}, ['section4']));
        }
        isOk && dispatch(action.assign({trackLoaded: true}));
      });
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
    onTopTabChange: topTabChangeActionCreator,
    onClick: clickActionCreator,
  };

  return connect(mapStateToProps, actionCreators)(EnhanceLoading(OrderInfoPage));
};

export default createOrderInfoPageContainer;
