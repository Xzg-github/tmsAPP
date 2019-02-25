import express from 'express';
import {postOption, fetchJsonByNode} from '../../../common/common';
import {host} from '../../globalConfig';

const tms_service = `${host}/tms-service`;
const archiver_service = `${host}/archiver-service`;
const tenant_service = `${host}/tenant-service`;

let api = express.Router();

api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

api.post('/list', async (req, res) => {
  const url = `${tms_service}/customer_price/list/search`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, returnMsg: 'Success', result: {
    data: [
      {
				"id": 1,
				"customerPriceCode": "系统编号",
				"customerId": {"value": "customer", "title": "名称"},
				"contractCode": "合同号",
				"balanceCompany": {"value": "结算单位", "title": "名称"},
        "startTime": "2019-02-21",
				"endTime": "2019-02-22",
				"fileList": [{
          "fileUrl": "http://oss-cn-shenzhen.aliyuncs.com/hyl365/hyl365/driver/3851771522222755985",
          "fileName": "附件1", "fileFormat": "url"
        },{
          "fileUrl": "http://oss-cn-shenzhen.aliyuncs.com/hyl365/hyl365/driver/3851771522222755985",
          "fileName": "附件2", "fileFormat": "url"
        }],
				"remark": "备注",
				"insertTime": "2019-02-21",
				"insertUser": {"value": "创建人员", "title": "名称"},
				"insertInstitution": {"value": "创建机构", "title": "名称"},
				"updateTime": "2019-02-21",
				"updateUser": {"value": "更新人员", "title": "名称"},
				"lockStatus": "0",
				"statusType": "enabled_type_unenabled"
      }
    ],
    returnTotalItem: 100
  }})
});

api.post('/customer', async (req, res) => {
  const url = `${archiver_service}/customer/drop_list`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

api.post('/user', async (req, res) => {
  const url = `${tenant_service}/user/drop_list`;
  const data = await fetchJsonByNode(req, url, postOption(req.body));
  if (data.returnCode === 0) {
    data.result = data.result.map(o => ({value: o.guid, title: o.username}));
  }
  res.send(data);
});

api.post('/delete', async (req, res) => {
  const url = `${archiver_service}/customer_price_master/batch`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
  res.send({returnCode: 0, returnMsg: 'Success', result: 'Success'});
});

api.post('/able', async (req, res) => {
  const url = `${archiver_service}/customer_price_master/batch/${req.body.enabledType}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
  res.send({returnCode: 0, returnMsg: 'Success', result: 'Success'});
});

api.get('/refresh/:id', async (req, res) => {
  const url = `${archiver_service}/customer_price_master/${req.params.id}`;
  // res.send(await fetchJsonByNode(req, url));
  res.send({returnCode: 0, returnMsg: 'Success', result: []});
});

export default api;
