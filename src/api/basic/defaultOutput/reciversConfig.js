const notify_type_email  = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'recipientMail', title: '接收邮箱', type: 'text'},
  {key: 'recipientName', title: '接收人', type: 'text'},
];

const notify_type_sms  = [
  {key: 'checked', title: '', type: 'checkbox'},
  {key: 'index', title: '序号', type: 'index'},
  {key: 'phoneNumber', title: '手机号码', type: 'number'},
];


const data = {
  notify_type_email,
  notify_type_sms,
  tableItems: [],
  buttons : [
    {key: 'add', title: '新增'},
    {key: 'delete', title: '删除'},
  ],
  config: {ok: '确定', cancel: '取消'}
};

export default data;
