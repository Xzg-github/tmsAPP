/*
公共获取表单状态的方法 传入的key 为表单状态类型（可以在平台管理-系统配置-表单状态配置里 增删改查）
*/
import {fetchJson,showError} from './common';
const URL_STATUS = '/api/common/statusType';

const getStatus = async (key) => {
  const { result, returnCode, returnMsg } = await fetchJson(`${URL_STATUS}/${key}`);  // 获取状态
  if (returnCode !== 0) {
    showError(returnMsg);
    return { returnCode: -1 };
  } else {
    return { returnCode, returnMsg, result };
  }
};
export {getStatus};
