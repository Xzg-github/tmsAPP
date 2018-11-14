const setting = [
  {key: 'modeName', type: 'text', title: '模板类型', readOnly: true },
  {key: 'reportName', type: 'text', title: '模板名称'},
  {key: 'isOnlyMail', type: 'checkbox', title: '仅发邮件', options:[{ value: 1, title: '是' }, { value: 0, title: '否', }] },
  {key: 'outputType', type: 'select', title: '默认输出格式', options: [{ value:'HTML', title: 'HTML' },{ value:'WORD', title: 'WORD' },{ value:'PDF', title: 'PDF' }]},
  {key: 'save', type: 'button', title: '保存'},
  {key: 'add', type: 'button', title: '添加'},
  {key: 'del', type: 'button', title: '删除'},
  {key: 'preview', type: 'button', title: '预览'},
];

const config = {
  setting,
  modeListTree: {},
  dataSourceTree: {},
  baseInfo: {},
  modeListExpand: {},
  dataSourceExpand: {},
};

export default config;
