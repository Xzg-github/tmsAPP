import {searchConfig} from '../../globalConfig';

const tableCols = [
  {key: 'departmentName', title: '部门'},
  {key: 'userName', title: '用户'},
  {key: 'userCellphone', title: '电话'},
  {key: 'userEmail', title: '邮件'}
];

const config = {
  title: '请先搜索再添加收件人/抄送人',
  filters: [
    {key:'filter', title:'部门/用户', type: 'text'}
  ],
  tableCols,
  footer:{
    ok: '确定',
    cancel: '取消'
  },
  searchConfig
};

export default config;
