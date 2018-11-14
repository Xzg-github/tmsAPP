const data = {
  returnCode: 0,
  returnMsg: '成功',
  result: {
    returnTotalItem: 100,
    data: [
      {
        "guid":"guid",
        "carMode":"车型",
        "length":"长",
        "width":"宽",
        "height":"高",
        "maxWeight":"最大装载重量",
        "maxVolume":"最大装载体积",
        "active":"激活状态",
        "containerRate":"标准柜比例", // 下拉，1或2
        "isContainer":"是否柜车",
        "containerType":"柜车类型", //下拉， 系统字典
        "containerCode":"柜型标准代码",
        "remark":"备注"
      },
      {guid: '20170324', active: 0},
      {guid: '20170325', active: 0},
      {guid: '20170326', active: 0}
    ]
  }
};

export default data;
