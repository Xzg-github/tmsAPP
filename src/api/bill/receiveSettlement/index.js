import express from 'express';
import {fetchJsonByNode, postOption} from '../../../common/common';
import {host} from '../../globalConfig';
import  {search} from "../../helper";
const service = `${host}/archiver-service`;
const charge_service = `${host}/charge_service`;
let api = express.Router();

// 获取UI标签
api.get('/config', async (req, res) => {
  const module = await require('./config');
  res.send({returnCode: 0, result: module.default});
});

// 自定义表单字段
api.get('/custom_config/:code', async (req, res) => {
  const url = `${service}/table_extend_property_config/config/${req.params.code}`;
  const config = await fetchJsonByNode(req, url);
  config.result.controls = config.result.controls || [];
  // res.send(config);
  res.send({returnCode: 0, result: {controls: []}});
});

// 获取列表
api.post('/list', async (req, res) => {
  const url = `${service}/transport_order/income/search`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  let str = req.body.filter.incomeTag.repeat(6);
  res.send({returnCode: 0, result: {data: [
    {
      id: str,
      guid: "f127c452-b200-479c-8e9c-cb1a9dca305b",
      orderNumber: str,
      customerDelegateCode: str,
      customerId: {value: str, title: str},
      businessType: 'business_type_dispatching',
      planPickupTime: '2018-11-26',
      'statusType': 'status_check_all_completed',
      "customerGuid":{"value":"b8ce4533-7265-45f1-a9b1-f28683c1696b","title":"testhcj"},
    }
  ], returnTotalItem: 100}});
});

// 获取币种
api.get('/currency', async (req, res) => {
  const url = `${charge_service}/tenant_currency_type/tenant_guid/list`;
  // res.send(await fetchJsonByNode(req, url));
  res.send({"returnCode":0,"returnMsg":"Success","result":[{"title":"CAD","value":"CAD","exchangeRate":1.2323},{"title":"HKD","value":"HKD","exchangeRate":0.825},{"title":"EUR","value":"EUR","exchangeRate":11.2},{"title":"USD","value":"USD","exchangeRate":1.789},{"title":"CNY","value":"CNY","exchangeRate":1}],"success":true});
});

// 获取客户下拉
api.post('/customerId', async (req, res) => {
  const url = `${service}/customer/drop_list`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: [{value: '111111', title: '111111'}]});
});

// 获取客服人员下拉
api.post('/customerServiceId', async (req, res) => {
  // const url = `${service}/customer/drop_list`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: [{value: '111111', title: '111111'}]});
});

// 获取车型下拉
api.post('/carModeId', async (req, res) => {
  // const url = `${service}/customer/drop_list`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: [{value: '111111', title: '111111'}]});
});

// 获取始发地、目的地下拉
api.post('/departureDestination', async (req, res) => {
  // const url = `${service}/customer/drop_list`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: [{value: '111111', title: '111111'}]});
});

// 获取单条记录的详细信息
api.get('/detail/:guid', async (req, res) => {
  const url = `${service}/income/${req.params.guid}`;
  // res.send(await fetchJsonByNode(req, url));
  res.send({"returnCode":0,"returnMsg":"Success","result":{"costDetailList":[{number:1,"businessCode":{"value":"mainland_hk_export_transport","title":"中港出口运输"},"serviceCode":{"value":"mainland_hk_transport","title":"中港运输"}, "price":1,"chargeMeasureUnit":"charge_unit_155","chargeNum":1,"amount":1,"currencyTypeCode":"CNY","exchangeRate":1,"tax":6,"taxType":"tax_rate_way_include","taxAmount":0.06,"netAmount":0.94,"isBilled":0,"guid":1267,"balanceNumber":"org-DO-181019-0007","balanceNumberGuid":"fa33ebd5-c3fb-4af0-a13e-7e242c7a5521","taskOrderNumber":"org-DO-181019-0007","balanceCompanyGuid":{"value":"117","title":"华恒润"},"insertUser":{"value":"6182c77e-57a2-4f6e-8be2-abcb3b13a341","title":"追美眉"},"updateUser":{"value":"65139640-1769-4efd-97c6-52af66e27531","title":"长城"},"statusType":"status_check_completed","chargeGuid":{"value":"2f298d0d1bc3419bbf013575311e892b","title":"保护费"},"insertDate":"2018-11-05 17:11:11","updateDate":"2018-11-20 11:34:18","serviceName":"中港运输","taskUnitCode":"cross_border_tons_car_export_transport","taskUnitName":"跨境吨车出口运输","originGuid":{"value":"22ef07b9-0599-409b-beb1-12701eb679f1","title":"org"},"isTransferReceivables":"true_false_type_false"},{"price":2,"businessCode":{"value":"mainland_hk_export_transport","title":"中港出口运输"},"serviceCode":{"value":"mainland_hk_transport","title":"中港运输"},"chargeMeasureUnit":"charge_unit_156","chargeNum":2,"amount":4,"currencyTypeCode":"CNY","exchangeRate":1,"tax":6,"taxType":"tax_rate_way_include","taxAmount":0.23,"netAmount":3.77,"isBilled":0,"guid":1268,"balanceNumber":"org-DO-181019-0007","balanceNumberGuid":"fa33ebd5-c3fb-4af0-a13e-7e242c7a5521","taskOrderNumber":"org-DO-181019-0007","balanceCompanyGuid":{"value":"117","title":"华恒润"},"insertUser":{"value":"6182c77e-57a2-4f6e-8be2-abcb3b13a341","title":"追美眉"},"updateUser":{"value":"65139640-1769-4efd-97c6-52af66e27531","title":"长城"},"statusType":"status_check_completed","chargeGuid":{"value":"c4c3cdf2-43ad-41af-9cf7-c05cb7304579","title":"cost_name001"},"insertDate":"2018-11-05 17:13:42","updateDate":"2018-11-20 11:34:18","serviceName":"中港运输","taskUnitCode":"cross_border_tons_car_export_transport","taskUnitName":"跨境吨车出口运输","originGuid":{"value":"22ef07b9-0599-409b-beb1-12701eb679f1","title":"org"},"isTransferReceivables":"true_false_type_true"},{"price":3,"businessCode":{"value":"mainland_hk_export_transport","title":"中港出口运输"},"serviceCode":{"value":"mainland_hk_transport","title":"中港运输"},"chargeMeasureUnit":"charge_unit_157","chargeNum":3,"amount":9,"currencyTypeCode":"CNY","exchangeRate":1,"tax":6,"taxType":"tax_rate_way_include","taxAmount":0.51,"netAmount":8.49,"remark":"","isBilled":0,"billNumber":"","containerNumber":"","carNumber":"","invoiceNumber":"","shipName":"","voyageNumber":"","goodsVariety":"","guid":1269,"balanceNumber":"org-DO-181019-0007","balanceNumberGuid":"fa33ebd5-c3fb-4af0-a13e-7e242c7a5521","taskOrderNumber":"org-DO-181019-0007","balanceCompanyGuid":{"value":"117","title":"华恒润"},"insertUser":{"value":"6182c77e-57a2-4f6e-8be2-abcb3b13a341","title":"追美眉"},"updateUser":{"value":"65139640-1769-4efd-97c6-52af66e27531","title":"长城"},"statusType":"status_check_completed","chargeGuid":{"value":"2f298d0d1bc3419bbf013575311e892b","title":"保护费"},"insertDate":"2018-11-05 17:13:52","updateDate":"2018-11-20 11:34:18","serviceName":"中港运输","taskUnitCode":"cross_border_tons_car_export_transport","taskUnitName":"跨境吨车出口运输","originGuid":{"value":"22ef07b9-0599-409b-beb1-12701eb679f1","title":"org"},"isTransferReceivables":"true_false_type_true"}],"mainCurrencyType":"CNY","incomeDetailList":[{number:1, "price":1,"chargeMeasureUnit":"charge_unit_155","chargeNum":1,"amount":1,"currencyTypeCode":"USD","exchangeRate":6.603,"tax":9,"taxType":"tax_rate_way_include","taxAmount":0.08,"netAmount":0.92,"isBilled":0,"balanceNumberGuid":"7f439b69-4085-432b-adc9-070007976e4f","guid":1991,"balanceCompanyGuid":{"value":"4aec72e1-2ef2-4faf-b76c-a31c7577e77f","title":"百度集团"},"insertUser":{"value":"6182c77e-57a2-4f6e-8be2-abcb3b13a341","title":"追美眉"},"statusType":"status_check_awaiting","chargeGuid":{"value":"90d1fde067a9489f9e5ef82bb65cbb4e","title":"包装费"},"insertDate":"2018-11-05 14:08:44","taskUnitCode":{"value":"cross_border_tons_car_export_transport","title":"跨境吨车出口运输"},"businessCode":{"value":"mainland_hk_export_transport","title":"中港出口运输"},"serviceCode":{"value":"mainland_hk_transport","title":"中港运输"},"originGuid":{"value":"22ef07b9-0599-409b-beb1-12701eb679f1","title":"org"}},{"price":2,"chargeMeasureUnit":"charge_unit_2151","chargeNum":2,"amount":4,"currencyTypeCode":"USD","exchangeRate":6.603,"tax":10,"taxType":"tax_rate_way_not_include","taxAmount":0.4,"netAmount":4,"isBilled":0,"balanceNumberGuid":"7f439b69-4085-432b-adc9-070007976e4f","guid":1999,"balanceCompanyGuid":{"value":"4aec72e1-2ef2-4faf-b76c-a31c7577e77f","title":"百度集团"},"insertUser":{"value":"6182c77e-57a2-4f6e-8be2-abcb3b13a341","title":"追美眉"},"statusType":"status_check_awaiting","chargeGuid":{"value":"3195eb95a6374876a08fe9ff65127e15","title":"运费"},"insertDate":"2018-11-05 16:39:31","taskUnitCode":{"value":"cross_border_tons_car_export_transport","title":"跨境吨车出口运输"},"businessCode":{"value":"mainland_hk_export_transport","title":"中港出口运输"},"serviceCode":{"value":"mainland_hk_transport","title":"中港运输"},"originGuid":{"value":"22ef07b9-0599-409b-beb1-12701eb679f1","title":"org"}},{"price":3,"chargeMeasureUnit":"charge_unit_2151","chargeNum":2,"amount":6,"currencyTypeCode":"USD","exchangeRate":6.603,"tax":10,"taxType":"tax_rate_way_not_include","taxAmount":0.6,"netAmount":6,"isBilled":0,"balanceNumberGuid":"7f439b69-4085-432b-adc9-070007976e4f","guid":2000,"balanceCompanyGuid":{"value":"4aec72e1-2ef2-4faf-b76c-a31c7577e77f","title":"百度集团"},"insertUser":{"value":"6182c77e-57a2-4f6e-8be2-abcb3b13a341","title":"追美眉"},"statusType":"status_check_awaiting","chargeGuid":{"value":"3195eb95a6374876a08fe9ff65127e15","title":"运费"},"insertDate":"2018-11-05 16:39:31","taskUnitCode":{"value":"cross_border_tons_car_export_transport","title":"跨境吨车出口运输"},"businessCode":{"value":"mainland_hk_export_transport","title":"中港出口运输"},"serviceCode":{"value":"mainland_hk_transport","title":"中港运输"},"originGuid":{"value":"22ef07b9-0599-409b-beb1-12701eb679f1","title":"org"}}]},"success":true});
});

// 获取汇总信息
api.get('/total/:guid/:currency', async (req, res) => {
  const url = `${service}/income/count/amount/${req.params.guid}/${req.params.currency}`;
  // res.send(await fetchJsonByNode(req, url));
  res.send({returnCode: 0, result: {
    profit: 0,
    totalPayableAmount: 0,
    totalPayableNetAmount: 0,
    totalReceivableAmount: 0,
    totalReceivableNetAmount: 0
  }});
});

// 通过应收结算单id获取作业单元、服务类型、业务类型等
api.get('/taskUnit', async (req, res) => {
  const url = `${service}/income/taskUnit_service_business/${req.query.guid}`;
  // res.send(await fetchJsonByNode(req, url));
  res.send({"returnCode":0,"returnMsg":"Success","result":[{"taskUnitTypeGuid":"2f7fde8f-6039-4e5a-94d6-b20ae16a1047","taskUnitCode":"cross_border_tons_car_export_transport","taskUnitName":"跨境吨车出口运输","businessCode":"mainland_hk_export_transport","businessName":"中港出口运输","serviceCode":"mainland_hk_transport","serviceName":"中港运输"}],"success":true})
});

// 整审（批量）
api.post('/auditBatch', async (req, res) => {
  const url = `${service}/income/check/batch`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
  res.send({returnCode: 0, result: 'Success', returnMsg: '整审成功！'});
});

// 整审（批量）检查
api.post('/audit/preparing', async (req, res) => {
  const url = `${service}/income/check/preparing`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: '该结算单未产生费用，是否继续审核？', returnMsg: 'Success'});
});

// 生成结算单
api.post('/createBill', async (req, res) => {
  const url = `${charge_service}/receivable_bills`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: 'Success', returnMsg: '生成结算单成功！'});
});

// 根据结算单位获取结算币种
api.get('/appiont/:aid', async (req, res) => {
  const url = `${charge_service}/customer/base_info/${req.params.aid}`;
  // res.send(await fetchJsonByNode(req, url));
  res.send({"returnCode":0,"errorCode":"0","returnMsg":"操作成功","result":"CNY"});
});

// 应收明细批量新增
api.post('/batchAdd', async (req, res) => {
  const url = `${service}/income/income_details`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: 'Success', returnMsg: '新增成功！'});
});

// 应收明细批量编辑
api.post('/batchEdit', async (req, res) => {
  const url = `${service}/income/income_details`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
  res.send({returnCode: 0, result: 'Success', returnMsg: '修改成功！'});
});

// 应收明细表格批量删除
api.post('/batchDelete', async (req, res) => {
  const url = `${service}/income/income_details`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
  res.send({returnCode: 0, result: 'Success', returnMsg: '删除成功！'});
});

// 应收明细表格批量审核
api.post('/batchAudit', async (req, res) => {
  const url = `${service}/income/income_details`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
  res.send({returnCode: 0, result: 'Success', returnMsg: '审核成功！'});
});

// 冲账
api.post('/strikeBalance/:id', async (req, res) => {
  const url = `${service}/income/strike_a_balance/${req.params.id}`;
  // res.send(await fetchJsonByNode(req, url, 'put'));
  res.send({returnCode: 0, result: 'Success', returnMsg: '冲账成功！'});
});

// 自动计费
api.post('/autoBilling/:guid', async (req, res) => {
  const url = `${service}/income/income_details/auto/${req.params.guid}`;
  // res.send(await fetchJsonByNode(req, url, postOption(req.body)));
  res.send({returnCode: 0, result: 'Success', returnMsg: '自动计费成功！'});
});
















// 档案号编辑
api.post('/document_number', async (req, res) => {
  const url = `${service}/income/document_number`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, "put")));
});

// 获取币种
api.get('/currency', async (req, res) => {
  const url = `${service}/tenant_currency_type/tenant_guid/list`;
  // res.send(await fetchJsonByNode(req, url));
  res.send({returnCode: 0, result: []});
});

// 整审
api.put('/audit/:guid', async(req, res) => {
  const url = `${service}/income/check/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url, 'put'));
});

// 明细批量新增
api.post('/details', async (req, res) => {
  const url = `${service}/income/income_details`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 明细批量修改
api.put('/details', async (req, res) => {
  const url = `${service}/income/income_details`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

// 明细批量删除
api.delete('/details', async (req, res) => {
  const url = `${service}/income/income_details`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'delete')));
});

// 明细批量审核
api.put('/details/audit', async (req, res) => {
  const url = `${service}/income/income_details/check`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body, 'put')));
});

const convertKey = (json) => {
  const {returnCode, result} = json;
  if (returnCode === 0) {
    const table = {
      profit: 'profit',
      totalPayableAmount: 'payAmount',
      totalPayableNetAmount: 'payNetAmount',
      totalReceivableAmount: 'receiveAmount',
      totalReceivableNetAmount: 'receiveNetAmount'
    };
    json.result = Object.keys(table).reduce((res, key) => {
      res[table[key]] = result[key];
      return res;
    }, {});
  }
  return json;
};

// 获取汇总信息
api.get('/total/:guid/:currency', async (req, res) => {
  const url = `${service}/income/count/amount/${req.params.guid}/${req.params.currency}`;
  res.send(convertKey(await fetchJsonByNode(req, url)));
});
// 获批量审核检查
api.post('/income/check/preparing', async (req, res) => {
  const url = `${service}/income/check/preparing`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)))
});

// 批量审核
api.post('/income/check/batch', async (req, res) => {
  const url = `${service}/income/check/batch`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)))
});

// 通过应收结算单id获取作业单元、服务类型、业务类型等
api.get('/income/taskUnit_service_business', async (req, res) => {
  const url = `${service}/income/taskUnit_service_business/${req.query.guid}`;
  res.send(await fetchJsonByNode(req, url));

});

// 根据供应商获取结算单位
api.post('/customer/balance/drop_list/:aid', async (req, res) => {
  const url = `${host}/customer_service/customer/balance/drop_list/${req.params.aid}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)))
});

//指定客户的客服列表
api.get('/customer/care/list/:aid', async (req, res) => {
  const url = `${host}/customer_service/customer/care/list/${req.params.aid}`;
  res.send(await fetchJsonByNode(req, url));
});


// 非指定客户的客服列表
api.post('/name', async (req, res) => {
  const url = `${host}/tenant_service/user/name/search`;
  res.send(await search(req, url, 'username', req.body.filter));
});

//获取导入数据
api.get('/importDetails/:aid', async (req, res) => {
  // const module = await require('./data');
  const url = `${service}/income_or_cost/import/view/${req.params.aid}`;
  res.send(await fetchJsonByNode(req, url));
});

//导入数据调整后批量新增接口
api.post('/income_details_import', async (req, res) => {
  const url = `${service}/income/income_details/import`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// 导出数据到excel
api.post('/export', async (req, res) => {
  const postData = {
    search: req.body.search,
    gridConfig: req.body.gridConfig,
    api: `${host}${req.body.api}`,
    method: 'post',
    pageResult: false,
  };
  const url = `${host}/integration_service/load/excel`;
  res.send(await fetchJsonByNode(req, url, postOption(postData)));
});

//获取应收费用分摊列表数据
api.get('/income_apportionment_list/:aid', async (req, res) => {
  // const module = await require('./data');
  const url = `${service}/income_apportionment/list/${req.params.aid}`;
  res.send(await fetchJsonByNode(req, url));
  //res.send(module.default.app);
});

//重新分摊
api.post('/income_apportionment', async (req, res) => {
  const url = `${service}/income_apportionment`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

//根据结算单位获取结算币种
api.get('/customer/base_info/:aid', async (req, res) => {
  const url = `${host}/customer_service/customer/base_info/${req.params.aid}`;
  const data = await fetchJsonByNode(req, url);
  if (data.returnCode === 0) {
    data.result = data.result.balanceCurrency;
  }
  res.send(data);
});

// 获取客户习惯费用项
api.get('/chargeItems/:id', async (req, res) => {
  const url = `${host}/charge_service_merge/customer_charge_item/custom/charge_items/${req.params.id}`;
  res.send(await fetchJsonByNode(req, url));
});

// 通过应收结算id获取DO列表
api.get('/delivery_orders/:aid', async (req, res) => {
  // const module = await require('./data');
  const url = `${service}/income/delivery_orders/${req.params.aid}`;
  res.send(await fetchJsonByNode(req, url));
});

// 编辑-自动计费
api.post('/auto_billing/:guid', async (req, res) => {
  const url = `${service}/income/income_details/auto/${req.params.guid}`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

// // 生成结算单配置
// api.get('/createSettlement_config', async (req, res) => {
//   const module = await require('./createSettlementConfig');
//   res.send({returnCode: 0, result: module.default});
// });

// 获取生成结算单列表
api.get('/createSettlement_list', async (req, res) => {
  const url = `${service}/un_balanced/logistics_orders`;
  res.send(await fetchJsonByNode(req, url));
});

// 批量生成结算单
api.post('/createSettlement_save', async (req, res) => {
  const url = `${service}/income/save/un_balanced/logistics_orders`;
  res.send(await fetchJsonByNode(req, url, postOption(req.body)));
});

export default api;
