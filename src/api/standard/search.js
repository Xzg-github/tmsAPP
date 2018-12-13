import {host, maxSearchCount} from '../globalConfig';
import {fetchJsonByNode, postOption} from '../../common/common';

const fetchJsonWithConvert = async (convert, req, url, option) => {
  const json = await fetchJsonByNode(req, url, option);
  return json.returnCode === 0 ? {returnCode: 0, result: json.result.map(convert)} : json;
};

const handlers = {};

// 用户下拉
handlers['user'] = (req, filter) => {
  const url = `${host}/tenant-service/user/drop_list`;
  const option = postOption({maxNumber: maxSearchCount, filter});
  const convert = item => ({value: item.guid, title: item.username});
  return fetchJsonWithConvert(convert, req, url, option);
};

// 客户(激活)
handlers['customer'] = (req, filter) => {
  const url = `${host}/archiver-service/customer/drop_list/enabled_type_enabled`;
  const option = postOption({maxNumber: maxSearchCount, filter});
  return fetchJsonByNode(req, url, option);
};

// 供应商(激活)
handlers['supplier'] = (req, filter) => {
  const url = `${host}/archiver-service/supplier/drop_list/enabled_type_enabled`;
  const option = postOption({maxNumber: maxSearchCount, filter});
  return fetchJsonByNode(req, url, option);
};

// 客户(所有)
handlers['customer_all'] = (req, filter) => {
  const url = `${host}/archiver-service/customer/drop_list`;
  const option = postOption({maxNumber: maxSearchCount, filter});
  return fetchJsonByNode(req, url, option);
};

// 供应商(所有)
handlers['supplier_all'] = (req, filter) => {
  const url = `${host}/archiver-service/supplier/drop_list`;
  const option = postOption({maxNumber: maxSearchCount, filter});
  return fetchJsonByNode(req, url, option);
};

// 物流公司(激活)
handlers['lo_company'] = (req, filter) => {
  const url = `${host}/archiver-service/logistics_company/drop_list/enabled_type_enabled`;
  const option = postOption({maxNumber: maxSearchCount, logisticsName: filter});
  return fetchJsonByNode(req, url, option);
};

// 物流公司(所有)
handlers['lo_company_all'] = (req, filter) => {
  const url = `${host}/archiver-service/logistics_company/drop_list`;
  const option = postOption({maxNumber: maxSearchCount, logisticsName: filter});
  return fetchJsonByNode(req, url, option);
};

// 组织机构
handlers['institution'] = (req, filter) => {
  const url = `${host}/tenant-service/institution/drop_list`;
  const option = postOption({institutionName:filter,active:'active_activated'});
  return fetchJsonByNode(req, url, option);
};

// 币种下拉
handlers['currency'] = (req, filter) => {
  const url = `${host}/archiver-service/charge/tenant_currency_type/drop_list`;
  const option = postOption({currencyTypeCode: filter, maxNumber: 65536});
  return fetchJsonByNode(req, url, option);
};

// 指定客户联系人
handlers['cunstomer_contacts'] = (req, filter) => {
  const url = `${host}/archiver-service/customer_contact/${req.params.id}/drop_list/enabled_type_enabled`;
  return fetchJsonByNode(req, url);
};


export const search = async (req, type, filter='') => {
  const handler = handlers[type];
  return handler ? await handler(req, filter) : {returnCode: 404, returnMsg: `类型[${type}]不存在`};
};
