
import { Modal } from 'antd';
import {getActions} from './common';

/**
 * 功能：将待提交的表单数据中为key：{title，value}的数据转成key：value
 *  obj：[必须]，对象(一般为表单数据对象)
 * 返回值：转化后的对象
 */
const toFormValue = (obj, titleKeys = []) => {
  let newObj = Object.assign({}, obj);
  for(let key of Object.keys(obj)) {
    if(Array.isArray(obj[key])){
      newObj[key] = obj[key];
    }else if(obj[key] && typeof obj[key] === 'object') {
      newObj[key] = titleKeys.findIndex(titleKey => titleKey == key) >= 0 ? obj[key].title : obj[key].value;
    }
  }
  return newObj;
};

/**
 * 功能：将待提交的表格数据中为key：{title，value}的数据转成key：value
 *  arr：[必须]，数组(一般为表格数据对象数组)
 * 返回值：转化后的数组
 */
const toTableValue = (arr) => {
  return arr.map(item => toFormValue(item));
};

/**
 * 功能：弹出提示信息
 */
const showInfo = (content, title='提示') => {
  Modal.error({title, content});
};

const hasSign = (pageSign, sign, trimPrefix=false) => {
  const actions = getActions(pageSign, trimPrefix);
  return actions.length < 1 ||  actions.findIndex(item => item === sign) !== -1;
};

const dealActions = (buttons=[], pageSign, trimPrefix=false) => {
  const actions = getActions(pageSign, trimPrefix);
  return buttons.reduce((arr, button) => {
    const sign = button.sign || button.key;
    if (!sign || actions.length < 1 ||  actions.findIndex(item => item === sign) !== -1) {
      arr.push(button);
    }
    return arr;
  }, []);
};

//获取表格中某个时间字段最大or最小时间
const getTime = (tableItems=[], key, bMax = false) => {
  let reTime = '';
  const compareTime = (t1, t2) => {
    const isBigger = (new Date(t1.replace(/-/g,"\/"))) > (new Date(t2.replace(/-/g,"\/")));
    if (bMax) {
      return isBigger ? t1 : t2;
    }else {
      return isBigger ? t2 : t1;
    }
  };
  tableItems.map(item => {
    item[key] && (reTime = reTime ? compareTime(reTime, item[key]) : item[key]);
  });
  return reTime;
};

export {
  toFormValue,
  toTableValue,
  showInfo,
  dealActions,
  hasSign,
  getTime
};
