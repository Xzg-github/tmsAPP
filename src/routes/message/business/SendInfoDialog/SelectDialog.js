import React from 'react';
import {ModalWithDrag, SuperToolbar, SuperTable, Search, Card, SuperForm} from '../../../../components/index';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SendInfoDialog.less';
import { fetchJson, showSuccessMsg, showError,postOption } from '../../../../common/common';
import showPopup from '../../../../standard-business/showPopup';
import {Checkbox,Input,Form} from 'antd';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;


const getContactList = async (searchData={},sendType,key) => {
    let url, options;
    if(key == 'fromMailBook'){
      url = '/api/message/business/msg_fromMailBook_list';
      options = {...searchData};
    }else if(key == 'fromArchives'){
      url = '/api/message/business/msg_fromArchives_list';
      options = {
        filter:{
          username: searchData.contactName,
          departmentName: searchData.departmentGuid
        }
      };
    };
    const {returnCode,result,returnMsg} = await fetchJson(url, postOption({...options, itemFrom: 0, itemTo: 65536}));
    if(returnCode == 0){
      if(key == 'fromArchives'){
        result.forEach(o=>{
          o.contactName = o.userName;
          o.email = o.userEmail;
          o.mobile = o.userCellphone;
        });
      }
      return result;
    }else {
      showError(returnMsg);
      return [];
    }
};

class SelectDialog extends React.Component {

  constructor(props){
    super(props);
    this.initState(props);
    this.onClick = this.onClick.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.addGroupOk = this.addGroupOk.bind(this);
    this.addContactOk = this.addContactOk.bind(this);
  }

  initState = (props) => {
    const {searchData,sendType,items,filters,cols,addContactConfig,activeKey} = props;
    this.state = {
      data: searchData,
      sendTypeVal: sendType.value,
      items,
      filters,
      cols,
      showAddGroup:false,
      showAddContact:false,
      newGroupName:'',
      addContactConfig,
      activeKey
    }
  }

  oCheckType = (value) => {
    this.setState({
      sendTypeVal:value
    });
  };

  onChange = (key,value) => {
    const {data} = this.state;
    if(key == 'departmentGuid'){
      data[key] = value.title;
    }else{
      data[key] = typeof value == 'object' ? value.value : value;
    }
    this.setState({ data });
  };

  onAddContactChange = (key,value) => {
    const {addContactConfig} = this.state;
    addContactConfig.value[key] = value;
    this.setState({addContactConfig});
  }

  onNewGroupNameChange = (e) => {
    const {newGroupName} = this.state;
    this.setState({newGroupName:e.target.value});
  }

  async onSearch (key,value,control) {
    const {filters,addContactConfig} = this.state;
    switch (key) {
      case 'groupName':
        const {returnCode,result,returnMsg} = await fetchJson('/api/message/business/msg_mygroup');
        let newResult = [];
        if(returnCode == 0){
          newResult =  result.map(o=>{
            o.title = o.groupName;
            o.value = o.groupName;
            return o;
          });
        }else{
          showError(returnMsg);
        }
        filters[0].options = newResult;
        addContactConfig.controls[4].options = newResult;
        this.setState({filters,addContactConfig});
        break;
      case 'departmentGuid':
        const res = await fetchJson('/api/basic/roleDataAuthority/branch', postOption({filter: ''}));
        filters[0].options = res.result.data;
        this.setState({filters});
        break;
    }
  }

  async onSearchAction () {
    const {data,sendTypeVal,activeKey} = this.state;
    let list = await getContactList(data,sendTypeVal,activeKey);
    this.setState({items:list,data,sendTypeVal,activeKey});
  }

  onCheck = (isAll, checked, rowIndex) => {
    const {items} = this.state;
    const newItems = [...items];
    if(isAll){
      newItems.forEach(o=>{
        o.checked = checked;
      });
    }else{
      newItems[rowIndex].checked = checked;
    }
    this.setState({items:newItems});
  };

  async onClick(btn) {
    const key = btn.split('_')[0];
    switch (key) {
      case 'search':
      const {activeKey} = this.props;
        this.onSearchAction();
      case 'reset':
        this.setState({data:{}});
        break;
      case 'delete':
        const {items} = this.state;
        const checkedList = items.filter(o=>o.checked).map(o=>o.id);
        if(checkedList.length==0){
          return showError('未勾选数据！');
        }
        const {returnCode,result,returnMsg} = await fetchJson('/api/message/business/msg_delete_contact', postOption(checkedList));
        if(returnCode == 0){
          showSuccessMsg(returnMsg);
          this.onSearchAction();
        }else{
          showError(returnMsg);
        }
        break;
      case 'addContacts':
        this.setState({showAddContact:true});
        break;
      case 'addGroup':
        this.setState({showAddGroup:true});
        break;
    }
  };

  async addGroupOk() {
    const {newGroupName} = this.state;
    const groupName = newGroupName.replace(/(^\s*)|(\s*$)/g, '');
    if(!groupName){
      return showError('分组名称不能为空！');
    }
    const {returnCode,result,returnMsg} = await fetchJson('/api/message/business/msg_add_group', postOption({groupName:newGroupName}));
    if(returnCode == 0){
      showSuccessMsg(returnMsg);
    }else{
      showError(returnMsg);
    }
    this.addGroupClose();
  }

  addGroupClose = () => {
    this.setState({showAddGroup:false});
  }

  async addContactOk() {
    const {addContactConfig,data} = this.state;
    if( !addContactConfig.value.contactName || !addContactConfig.value.groupName || !addContactConfig.value.email || !addContactConfig.value.mobile ){
      return showError('请填写必填项！');
    }
    const options = [{
      ...addContactConfig.value,
      ...data,
      groupName: addContactConfig.value.groupName.groupName
    }];
    const {returnCode,result,returnMsg} = await fetchJson('/api/message/business/msg_add_contact', postOption(options));
    if(returnCode == 0){
      showSuccessMsg(returnMsg);
      this.onSearchAction();
    }else{
      showError(returnMsg);
    }
    this.addContactClose();
  }

  addContactClose = () => {
    let {addContactConfig} = this.state;
    addContactConfig.value = {};
    this.setState({showAddContact:false,addContactConfig});
  }

  onOk = (key,value) => {
    const {onOk,onClose} = this.props;
    const {items,sendTypeVal} = this.state;
    if(sendTypeVal.length==0){
      return showError('请选择发送方式！');
    }
    if(items.filter(o=>o.checked).length==0){
      return showError('请勾选一条数据！');
    }
    const newItems = items.filter(o=>o.checked).map(o=>{
      o.userGuid && (o.id = o.userGuid);
      o.sendType = sendTypeVal;
      return o;
    });
    onOk && onOk(newItems);
    onClose();
  }

  getProps = (width,onOk) => {
    const {title, onClose} = this.props;
    return {
      onCancel: onClose,
      onOk,
      title,
      width,
      visible: true,
      maskClosable: false
    };
  };

  toContent = (props) => {
    const {hasToolbar,buttons,config,sendType} = props;
    const {oCheckType,onChange,onSearch,onCheck,onClick} = this;
    const {data,sendTypeVal,items,filters,cols} = this.state;
    const searchProps = {data,config,filters,onChange,onSearch,onClick};
    const toolbarProps = {buttons,onClick};
    const checkboxProps = {
      value: sendTypeVal,
      options: sendType.options,
      onChange: oCheckType
    };
    const tableProps = {cols,items,callback:{onCheck},maxHeight:'400px'};
    return (
      <div className={s.root}>
        <Card className={s.pldCard}>
          <Search {...searchProps}/>
          {hasToolbar && <div className={s.toolBar}><SuperToolbar {...toolbarProps}/></div>}
          <CheckboxGroup className={s.checkBox} {...checkboxProps}/>
        </Card>
        <Card className={s.pldCard}><SuperTable {...tableProps}/></Card>
      </div>
    );
  };

  render() {
    const {...props} = this.props;
    const {showAddGroup,showAddContact,addContactConfig} = this.state;
    if(showAddContact){
      addContactConfig.onChange = this.onAddContactChange;
      addContactConfig.onSearch = this.onSearch;
    }
    const addGroupProps = {
      onCancel: this.addGroupClose,
      onOk: this.addGroupOk,
      title: '添加分组',
      width: 400,
      visible: true,
      maskClosable: false
    };
    const addContactProps = {
      onCancel: this.addContactClose,
      onOk: this.addContactOk,
      title: '添加联系人',
      width: 550,
      visible: true,
      maskClosable: false
    };
    return (
      <div className={s.root}>
        <ModalWithDrag {...this.getProps(900,this.onOk)}>
          {this.toContent(props)}
        </ModalWithDrag>
        {showAddGroup && (<ModalWithDrag {...addGroupProps}>
          <FormItem label='分组名称'>
            <Input onChange={this.onNewGroupNameChange}/>
          </FormItem>
        </ModalWithDrag>)}
        {showAddContact && (<ModalWithDrag {...addContactProps}>
          <SuperForm {...addContactConfig}/>
        </ModalWithDrag>)}
      </div>
    );
  }
}

export default withStyles(s)(SelectDialog);

const showSelectDialog = async (config,onOk,activeKey,hasToolbar) => {
  const {searchData={},sendType={}} = config;
  config.items = await getContactList(searchData,sendType,activeKey);
  const props = {
    activeKey,
    hasToolbar,
    onOk,
    ...config
  };
  showPopup(withStyles(s)(SelectDialog), props);
};

export {showSelectDialog};

