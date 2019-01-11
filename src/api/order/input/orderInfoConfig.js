const URL_CUSTOMER_CONTACT = '/api/order/input/options/customer_contacts';
const URL_SUPPLIER_DRIVER = '/api/order/input/options/supplier_drivers';

const baseForm = [
  {key: 'customerId', title: '客户', type:'search', searchType: 'customer', required: true},
  {key: 'customerDelegateCode', title: '委托号', type:'text'},
  {key: 'customerDelegateTime', title: '委托日期', type:'date', props:{showTime: true}, required: true},
  {key: 'businessType', title: '运输类型', type:'select', dictionary: 'business_type', required: true},
  {key: 'contactName', title: '客户联系人', type:'search', props: {searchWhenClick: true, noSearchWhenTypo: true}, showAdd: true , searchUrl: URL_CUSTOMER_CONTACT, required: true},
  {key: 'contactTelephone', title: '联系电话', type:'text'},
  {key: 'contactEmail', title: '联系邮箱', type:'text'},
  {key: 'transportType', title: '运输方式', type:'select', dictionary: 'transport_type', required: true},
  {key: 'planPickupTime', title: '要求装货时间', type:'date', props:{showTime: true}, required: true},
  {key: 'planDeliveryTime', title: '要求卸货时间', type:'date', props:{showTime: true}},
  {key: 'departure', title: '始发地', type:'readonly', required: true},
  {key: 'destination', title: '目的地', type:'readonly', required: true},
  {key: 'commodityDescription', title: '商品描述', type:'text'},
  {key: 'goodsNumber', title: '总数量', type:'readonly'},
  {key: 'volume', title: '总体积', type:'number', props: {real: true, precision: 4}},
  {key: 'roughWeight', title: '总重量', type:'number', props: {real: true, precision: 2}},
  {key: 'salespersonId', title: '销售员', type:'readonly'},
  {key: 'customerServiceId', title: '客服', type:'readonly', showAdd: true, required: true},
  {key: 'palletsNumber', title: '总卡板数', type:'number', props: {real: true, precision: 2}},
  {key: 'carModeId', title: '车型', type:'search', searchType: 'car_mode_active', required: true},
  {key: 'isSupervisor', title: '是否需要监理', type:'readonly', dictionary: 'zero_one_type', required: true},
];

const dispatchForm = [
  {key: 'carInfoId', title: '车牌', type:'search', searchType: 'car_all', required: true},
  {key: 'ownerCarTag', title: '是否自有车', type:'readonly', dictionary: 'zero_one_type', required: true},
  {key: 'supplierId', title: '供应商', type:'readonly', required: true},
  {key: 'driverId', title: '司机', type:'search', props: {searchWhenClick: true}, searchUrl: URL_SUPPLIER_DRIVER, required: true},
  {key: 'driverMobilePhone', title: '司机号码', type:'readonly'},
  {key: 'transportationDuration', title: '运输时长', type:'number', props: {real: true, precision: 2}},
  {key: 'taskTypeCode', title: '文件任务', type:'select', props: {mode: 'multiple'}, dictionary: 'task_type_file', span: 2},
];

const addForm = [
  {key: 'route', title: '路线', type:'textArea', props: {readonly: true}, span: 3},
  {key: 'totalMileage', title: '总里程', type: 'readonly'},
  {key: 'customerFactoryRemark', title: '装货注意事项', type:'textArea', span: 2},
  {key: 'dispatchRemark', title: '调度注意事项', type:'textArea', span: 2},
  {key: 'description', title: '附加说明', type:'textArea', span: 4},
];

const options = [
  {title: '发货', value: '0'},
  {title: '收货', value: '1'},
  {title: '收发货', value: '2'},
];

const addressCols = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'pickupDeliveryType', title: '收发货类型', type:'select', options},
  {key: 'consigneeConsignorId', title: '收发货人', type:'search', props: {searchWhenClick: true}, showAdd: true, required: true},
  {key: 'consigneeConsignorCode', title: '收发货人编码', type:'readonly'},
  {key: 'consigneeConsignorShortName', title: '收发货人简称', type:'readonly'},
  {key: 'contactName', title: '联系人', type:'search', props: {searchWhenClick: true}},
  {key: 'contactTelephone', title: '联系电话', type:'text'},
  {key: 'contactEmail', title: '联系邮箱', type:'text'},
  {key: 'consigneeConsignorAddress', title: '详细地址', type:'text'},
  {key: 'pickupGoodsNumber', title: '发货数量', type:'number', props: {real: true, precision: 2}},
  {key: 'deliveryGoodsNumber', title: '收货数量', type:'number', props: {real: true, precision: 2}},
  {key: 'isSupervisor', title: '是否监理', type:'select', dictionary: 'zero_one_type'},
];

const goodsCols = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'consignorId', title: '发货人', type:'select', required: true},
  {key: 'consigneeId', title: '收货人', type:'select', required: true},
  {key: 'commodityName', title: '商品名称', type:'text', required: true},
  {key: 'goodsNumber', title: '数量', type:'number', props: {real: true, precision: 2}},
  {key: 'volume', title: '体积', type:'number', props: {real: true, precision: 4}},
  {key: 'roughWeight', title: '重量', type:'number', props: {real: true, precision: 2}},
  {key: 'packageUnit', title: '包装单位', type:'select', dictionary: 'package_unit'},
  {key: 'commodityUnit', title: '基本单位', type:'select', dictionary: 'commodity_unit'},
];

const config = {
  formSections: {
    baseInfo: {key: 'baseInfo', title: '基本信息', controls: baseForm},
    dispatchInfo: {key: 'dispatchInfo', title: '派车信息', controls: dispatchForm}, //为补录运单时才展示该分组信息
    addInfo: {key: 'addInfo', title: '附加信息', controls: addForm},
  },
  addressTable: {
    cols: addressCols,
    buttons: [
      {key: 'add', title: '新增'},
      {key: 'del', title: '删除'},
      {key: 'up', title: '上移'},
      {key: 'down', title: '下移'},
      {key: 'count', title: '计算总里程'},
    ]
  },
  goodsTable: {
    cols: goodsCols,
    buttons: [
      {key: 'addGoods', title: '新增'},
      {key: 'delGoods', title: '删除'},
    ]
  },
  buttons: [
    {key: 'save', title: '保存'},
    {key: 'commit', title: '提交'},
  ],
  tabs: [
    {key: 'addressList', title: '收发货地址'},
    {key: 'goodsList', title: '货物明细'},
  ],
  activeKey: 'addressList'
};

export default config;
