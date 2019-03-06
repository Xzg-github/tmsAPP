
const data = {
  list: {
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
        "statusType": "enabled_type_unenabled",
        'enabledType': 'enabled_type_unenabled'
      }
    ],
    returnTotalItem: 100
  },
  detail: {
    fileList: [{
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
    "total": {
			"masterTotal": "30",
			"additionalTotal": "50"
		}
  },
  freightDetail: {
    data: [
      {
        "id": "标识",
        "customerPriceId": "客户报价标识",
        "businessType": "运输类型",
        "departure": {
          "value": "起运地",
          "title": "名称"
        },
        "departureType": "起发地类别",
        "destination": {
          "value": "目的地",
          "title": "名称"
        },
        "destinationType": "目的地类别",
        "isReturn": "是否返程",
        "carModeId": "车型",
        "fuelType": "燃油种类",
        "standardPrice": "基本运费",
        "returnPrice": "返程费",
        "chargeUnit": "计量单位",
        "numberSource": "数量源",
        "hours": "时效(小时)",
        "kilometre": "公里数（Km）",
        "remark": "备注",
        "enabledType": "状态",
        "insertTime": "创建时间",
        "insertUser": {
          "value": "创建人员",
          "title": "名称"
        },
        "updateTime": "更新时间",
        "updateUser": {
          "value": "更新人员",
          "title": "名称"
        }
      }
    ],
    returnTotalItem: 100
  }
};

export default data;
