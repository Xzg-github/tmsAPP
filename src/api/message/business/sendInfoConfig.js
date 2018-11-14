const sendInfoConfig = {
  title: '发送消息',
  buttons: [
    {key: 'fromMailBook_SendIndo', title: '从通讯录选择', bsStyle: 'primary'},
    {key: 'fromArchives_SendIndo', title: '从档案选择'},
    {key: 'delete_SendIndo', title: '移除'}
  ],
  cols: [
    {key: 'checked',type:"checkbox",title: ''},
    {key: 'contactName', title: '收信人', type: 'text'},
    {key: 'email', title: '收信人邮箱', type: 'text'},
    {key: 'mobile', title: '收信人手机', type: 'text'},
    {key: 'sendType', title: '发送方式', type: 'select',props:{mode:'mutiple'},options:[
        {value: 'web', title: '平台'},
        {value: 'sms', title: '短信'},
        {value: 'email', title: '邮箱'}
      ]
    }
  ],
  items: [],
  messageContent: {
    val: '',
    controls: [{
      key: 'messageContent',
      title: '消息内容 （限1000字以内）',
      type: 'textArea',
      rows:6,
      required: true,
      maxLength: 1000
    }],
    allFullFather:true
  },
  fromMailBook: {
    title: '从通讯录中选择',
    filters: [
      {key: 'groupName', title: '分组', type: 'search', options: []},
      {key: 'contactName', title: '联系人', type: 'text'}
    ],
    config: {search: '搜索',reset: '重置'},
    buttons: [
      {key: 'addContacts_fromMailBook', title: '新建联系人'},
      {key: 'delete_fromMailBook', title: '删除'},
      {key: 'addGroup_fromMailBook', title: '新建分组'}
    ],
    sendType: {
      value: [],
      options: [
        {value: 'sms', label: '短信'},
        {value: 'email', label: '邮箱'}
      ]
    },
    cols: [
      {key: 'checked',type:"checkbox",title: ''},
      {key: 'contactName', title: '联系人', type: 'text'},
      {key: 'email', title: '联系邮箱', type: 'text'},
      {key: 'mobile', title: '联系手机', type: 'text'},
      {key: 'groupName', title: '分组'}
    ],
    items: [],
    checkedList: [],
    searchData: {},
    newGroupName: '',
    addContactConfig:{
      colNum: 2,
      value:{},
      controls: [
        {key: 'contactName', title: '联系人', type: 'text',required:true},
        {key: 'email', title: '联系邮箱', type: 'text',required:true},
        {key: 'mobile', title: '联系手机', type: 'text',required:true},
        {key: 'post', title: '职务', type: 'text'},
        {key: 'groupName', title: '分组', type: 'search', options: [],required:true}
      ]
    }
  },
  fromArchives: {
    title: '从档案中选择',
    filters: [
      {key: 'departmentGuid', title: '部门', type: 'search', options: []},
      {key: 'contactName', title: '联系人', type: 'text'}
    ],
    config: {search: '搜索',reset: '重置'},
    sendType: {
      value: [],
      options: [
        {value: 'web', label: '平台'},
        {value: 'sms', label: '短信'},
        {value: 'email', label: '邮箱'}
      ]
    },
    cols: [
      {key: 'checked',type:"checkbox",title: ''},
      {key: 'contactName', title: '联系人', type: 'text'},
      {key: 'email', title: '联系邮箱', type: 'text'},
      {key: 'mobile', title: '联系手机', type: 'text'},
      {key: 'departmentName', title: '部门'}
    ],
    items: [],
    checkedList: [],
    searchData: {}
  }
};

export default sendInfoConfig;
