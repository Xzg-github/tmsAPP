import {fetchJsonByNode, postOption} from '../common/common';
import {maxSearchCount} from './globalConfig';

const convert = (arr, key) => {
  return arr.map(obj => ({value: obj.guid, title: obj[key],supplierGuid:obj.supplierGuid}));
};

// 范嗣利的模糊搜索接口
const search = async (req, url, key, filter, isAll=false) => {
  const body = {itemFrom: 0, itemTo: isAll ? 65536 : maxSearchCount, filter: {[key]: filter}};
  let json = await fetchJsonByNode(req, url, postOption(body));
  if (json.returnCode === 0) {
    json.result.data = convert(json.result.data, key);
  }
  return json;
};

// 黄家军的搜索接口
const searchByHjj = (req, url, key, filter) => {
  const body = {maxNumber: maxSearchCount, [key]: filter};
  return fetchJsonByNode(req, url, postOption(body));
};

const searchByHjj2 = async (req, url, key, filter) => {
  const body = {maxNumber: maxSearchCount, [key]: filter};
  let json = await fetchJsonByNode(req, url, postOption(body));
  if (json.returnCode === 0) {
    json.result = {data: json.result};
  }
  return json;
};

// 搜索内容适配
const searchAdapter = ({itemFrom, itemTo, filter={}}) => {
  return {...filter, itemFrom, itemTo};
};

export {search, searchByHjj, searchByHjj2, searchAdapter};
