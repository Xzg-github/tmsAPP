import {fetchJson, postOption, getObject, showError} from './common';

const DICTIONARY_URL = '/api/dictionary';

/**
 * 功能：批量获取字典
 * names：字典名数组
 */
const fetchDictionary = async (names) => {
  let json = {returnCode: 0, result: {}};

  if (!global.dictionary) {
    global.dictionary = {};
  }

  if (names.length === 0) {
    return json;
  }

  const fetchNames = names.filter(name => !global.dictionary.hasOwnProperty(name));
  if (fetchNames.length !== 0) {
    json = await fetchJson(DICTIONARY_URL, postOption({names}));
    if (json.returnCode === 0) {
      Object.assign(global.dictionary, getObject(json.result, fetchNames));
    } else {
      return json;
    }
  }

  Object.assign(json.result, getObject(global.dictionary, names));

  return json;
};

const getName = (item) => {
  if (item.dictionary) {
    return item.dictionary;
  } else if (item.from === 'dictionary' && item.position && !item.options) {
    return item.position;
  }
};

const addNames = (names, items) => {
  for (const item of items) {
    const name = getName(item);
    if (name && !names.includes(name)) {
      names.push(name);
    }
  }
  return names;
};

/**
 * 功能：批量获取字典
 * items：对象数组，对象中的from属性值为'dictionary'时，会被当做字典，此时position属性的值为字典名
 */
const fetchDictionary2 = (items) => {
  return fetchDictionary(addNames([], items));
};

/**
 * objArray：对象数组，一般是SuperTable(cols), SuperTable2(cols)、SuperForm(controls)和Search(filters)的参数
 * value：对象，key-value对，key为字典名，value为字典(对象数组)
 */
const setDictionary = (objArray=[], value={}, keyName='options') => {
  Array.isArray(objArray) &&
  objArray.every(obj => {
    if (obj.dictionary) {
      if (value[obj.dictionary]) {
        obj[keyName] = value[obj.dictionary];
      }
    } else if (obj.from === 'dictionary') {
      if (value[obj.position]) {
        obj[keyName] = value[obj.position];
      }
    }
    return true;
  });
};

// 根据obj(多个字典组合的对象，key是字典名)设置options到任意多个数组里
const setDictionary2 = (obj, ...rest) => {
  for (const items of rest) {
    if (Array.isArray(items)) {
      setDictionary(items, obj);
    }
  }
};

// 从任意多个数组里获取字典名，返回一个字典名数组
const getDictionaryNames = (...args) => {
  const names = [];
  for (const items of args) {
    if (Array.isArray(items)) {
      addNames(names, items);
    }
  }
  return names;
};

/*
公共获取表单状态的方法 传入的key 为表单状态类型（可以在平台管理-系统配置-表单状态配置里 增删改查）
*/
const getStatus = async (key) => {
  const { result, returnCode, returnMsg } = await fetchJson(`/api/common/statusType/${key}`,"get");  // 获取状态
  if (returnCode !== 0) {
    showError(returnMsg);
    return { returnCode: -1 };
  } else {
    return { returnCode, returnMsg, result };
  }
};

export {
  fetchDictionary,
  fetchDictionary2,
  setDictionary,
  setDictionary2,
  getDictionaryNames,
  getStatus,
}
