import express from 'express';
import {fetchJson, fetchJsonByNode, postOption} from '../../../common/common';
import {host} from '../../globalConfig';

const ipTraceService = `${host}/trace_service`;
const ipIntegrationService = `${host}/integration_service`;

const api = express.Router();
const integrationService = `${ipIntegrationService}`;
//const URL_LIST = `${ipTraceService}/deliveryContent/exportCabinet`;

// 导出数据到excel
/*api.post('/export1', async (req, res) => {
  const needPaging = 0;
  const search = req.body.search;
  let postData;
  if (req.body.isFilter == 1) {
    postData = {
      search: {needPaging, filter: search},
      gridConfig: req.body.gridConfig,
      api: `${host}${req.body.api}`,
      method: 'post',
      isPage: '1'
    };
  } else if (req.body.isFilter == 0) {
    postData = {
      search: {...search, needPaging},
      gridConfig: req.body.gridConfig,
      api: `${host}${req.body.api}`,
      method: 'post',
      isPage: '1'
    }
  } else {
    postData = {
      search: req.body.search,
      gridConfig: req.body.gridConfig,
      api: `${host}${req.body.api}`,
      method: 'post',
      isPage: '0',
    };
  }

  // const url = `${integrationService}/load/excel`;
  const url = `http://10.10.10.76:5555/integration_service_syq/load/excel`;
  res.send(await fetchJsonByNode(req, url, postOption(postData)));
});*/

// 导出数据到excel
api.post('/export', async (req, res) => {
  console.log('1111')
  let search = req.body.search;
  if(!search){
    search = {};
  }
  let postData = {
    search: search,
    gridConfig: req.body.gridConfig,
    api: `${req.body.api}`,
    method: req.body.method ? req.body.method : 'post',
    pageResult: (typeof req.body.pageResult == 'undefined') ? true : req.body.pageResult
  };
  const url = `${integrationService}/load/excel`;
  res.send(await fetchJsonByNode(req, url, postOption(postData)));
});


export default api;
