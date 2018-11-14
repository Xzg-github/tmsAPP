import {host} from '../globalConfig';
import {fetchJsonByNode, postOption} from '../../common/common';

const handlers = {};

// 服务类型
handlers['service_type'] = async (req) => {
  const url = `${host}/production-service/productType/service/select_current_product_type`;
  const json = await fetchJsonByNode(req, url);
  const convert = (item) => ({value: item.productTypeGuid.value, title: item.productTypeName});
  return json.returnCode === 0 ? json.result.map(convert) : [];
};

// 业务类型
handlers['business_type'] = async (req) => {
  const url = `${host}/production-service/productType/service/select_current_business_type`;
  const json = await fetchJsonByNode(req, url);
  return json.returnCode === 0 ? json.result : [];
};

// 作业单元
handlers['job_unit'] = async (req) => {
  const url = `${host}/production-service/task_unit_type/active/list`;
  const json = await fetchJsonByNode(req, url);
  const convert = (item) => ({value: item.guid, title: item.taskUnitTypeName});
  return json.returnCode === 0 ? json.result.map(convert) : [];
};

// 服务类型code
handlers['service_type_code'] = async (req) => {
  const url = `${host}/production-service/productType/service/select_current_product_type`;
  const json = await fetchJsonByNode(req, url);
  const convert = (item) => ({value: item.serviceTypeCode, title: item.productTypeName});
  return json.returnCode === 0 ? json.result.map(convert) : [];
};

// 业务类型code
handlers['business_type_code'] = async (req) => {
  const url = `${host}/production-service/productType/service/select_current_business_type_code`;
  const json = await fetchJsonByNode(req, url);
  return json.returnCode === 0 ? json.result : [];
};

// 作业单元code
handlers['job_unit_code'] = async (req) => {
  const url = `${host}/production-service/task_unit_type/active/list`;
  const json = await fetchJsonByNode(req, url);
  const convert = (item) => ({value: item.taskUnitCode, title: item.taskUnitTypeName});
  return json.returnCode === 0 ? json.result.map(convert) : [];
};

// 币种
handlers['currency'] = async (req) => {
  const url = `${host}/archiver-service/charge/tenant_currency_type/drop_list`;
  const json = await fetchJsonByNode(req, url, postOption({}));
  return json.result || [];
};

export const fetchSelect = async (req, type) => {
  const handler = handlers[type];
  return handler ? await handler(req) : [];
};

export const fetchSelectBatch = async (req, types) => {
  const obj = {};
  if (Array.isArray(types)) {
    for (const type of types) {
      if (!obj[type]) {
        obj[type] = await fetchSelect(req, type);
      }
    }
  }
  return obj;
};
