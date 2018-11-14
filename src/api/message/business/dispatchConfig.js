import {pageSize, pageSizeType, description, searchConfig} from '../../globalConfig';

const activeKey = 'inBox';
const tabs = [
  {key:'inBox',title:'收信箱',close:false},
  {key:'outBox',title:'发信箱',close:false}
];

const others = {
  searchData: {},
  currentPage: 1,
  tableItems: [],
  maxRecords: 0
};

const dispatchConfig = {
  activeKey,
  tabs,
  inBox: {
    filters: [
      {key: 'insertTimeFrom', title: '接收时间', type: 'date'},
      {key: 'insertTimeTo', title: '至', type: 'date'},
      {key: 'content', title: '消息内容', type: 'text'},
      {key: 'senderInfo', title: '发信人', type: 'text'}
    ],
    buttons: [
      {key: 'setToRead_Dispatch', title: '设为已读', bsStyle: 'primary'},
      {key: 'delete_Dispatch', title: '删除'}
    ],
    tableCols: [
      {key: 'insertTime', title: '接收时间', type: 'date', noWrap: true, width: 150},
      {key: 'senderInfo', title: '发信人', type: 'text', width: 200},
      {key: 'title', title: '标题', type: 'text', noWrap: true, width: 180},
      {key: 'content', title: '消息内容', type: 'text'},
      {key: 'result', title: '发送结果', type: 'text', noWrap: true, width: 70}
    ],
    pageSize,
    pageSizeType,
    description,
    searchConfig,
    ...others
  },
  outBox: {
    filters: [
      {key: 'insertTimeFrom', title: '发送时间', type: 'date'},
      {key: 'insertTimeTo', title: '至', type: 'date'},
      {key: 'content', title: '消息内容', type: 'text'},
      {key: 'recipientInfo', title: '收信人', type: 'text'}
    ],
    buttons: [
      {key: 'sendInfo_Dispatch', title: '发送消息', bsStyle: 'primary'}
    ],
    tableCols: [
      {key: 'result', title: '发送状态', type: 'text', noWrap: true, width: 70},
      {key: 'title', title: '标题', type: 'text', noWrap: true, width: 180},
      {key: 'insertTime', title: '发送时间', type: 'date', noWrap: true, width: 150},
      {key: 'recipientInfoSplicing', title: '收信人', type: 'text', width: 200},
      {key: 'content', title: '消息内容', type: 'text'}
    ],
    pageSize,
    pageSizeType,
    description,
    searchConfig,
    ...others
  }
};

export default dispatchConfig;
