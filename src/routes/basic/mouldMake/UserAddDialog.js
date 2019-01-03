import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Search, SuperTable, ModalWithDrag,SuperTable2,SuperToolbar,Title} from '../../../components';
import helper from '../../../common/common';
import s from './UserAddDialog.less';

const URL_USERS = '/api/platform/mouldMake/user_list';

const table2Cols = {
  buttons: [
    {key: 'add', title: '新增'},
    {key: 'delete', title: '删除'}
  ],

  tableCols : [
    {key: 'checked', title: '', type: 'checkbox'},
    {key: 'index', title: '序号', type: 'index'},
    {key: 'userEmail', title: '用户邮箱', type: 'text'},
  ]
};


class UserAddDialog extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    addKey: PropTypes.string,
    title: PropTypes.string.isRequired,
    tableCols: PropTypes.array.isRequired,
    tableItems: PropTypes.array,
    filters: PropTypes.array,
    searchConfig: PropTypes.object,
    searchData: PropTypes.object,
    onClose: PropTypes.func,
    onOkFunc: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.initState(props);
    this.onClick = this.onClick.bind(this);
    this.onOk = this.onOk.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.initState(nextProps);
  }

  initState = (props) => {
    this.state = {
      tableItems: props.tableItems,
      resultList: [],
      tableItems2:[]
    };
  };

  onChange = (key, value) => {
    this.setState({...this.state, searchData: {...this.state.searchData, [key]: value}});
  };

  async onClick(key) {
    if (key === 'reset') {
      const {tableItems} = this.props;
      this.setState({...this.state, searchData: {}, tableItems});
    }else if (key === 'search') {
      const url =  URL_USERS;
      const {returnCode, result, returnMsg} = await helper.fetchJson(url, helper.postOption(this.state.searchData));
      if (returnCode !== 0) {
        helper.showError(returnMsg);
        return;
      }
      this.setState({...this.state, tableItems: result});
    }
  };

  toSearch = () => {
    const {filters, searchConfig} = this.props;
    const props = {
      filters,
      data: this.state.searchData,
      config: searchConfig,
      onChange: this.onChange,
      onClick: this.onClick.bind(null)
    };
    return <div role="search"><Search {...props}/></div>
  };

  onCheck = ( isAll, checked, rowIndex) => {
    let tableItems = JSON.parse(JSON.stringify(this.state.tableItems))
    let newRowIndex = null;
    tableItems.forEach((item, index) => {
      if(rowIndex === -1){
        tableItems[index].checked = checked;
      }
    });
    if(rowIndex !== -1){
      tableItems[rowIndex].checked = checked;
    }
    tableItems[newRowIndex] = { ...tableItems[newRowIndex], checked };
    const resultList = tableItems.filter(x=>x.checked);
    this.setState({ tableItems: tableItems, resultList });
  };

  toTable = (cols, items=[]) => {
    const props = {
      cols,
      items,
      maxHeight: '300px',
      callback: {
        onCheck: this.onCheck
      }
    };
    return <div role="table"><SuperTable {...props}/></div>
  };

  toSaveList = (resultList) => {
    return resultList.reduce((arr, obj) => {
      const {userEmail} = obj;
      arr.push({userEmail});
      return arr;
    }, []);
  };

  emailReg = (tableItems2) => {
    let reg = true;
    const myreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;  // 邮箱格式校验正则
    let user  = tableItems2.reduce((arr, obj) => {
      const {userEmail} = obj;
      arr.push({userEmail});
      return arr;
    }, []);
    for(let u of user){
      if (!myreg.test(u.userEmail)) {
        return  false;
      }
    }
    return reg
  };

  async onOk() {
    let myReg = true;
    const {resultList,tableItems2} = this.state;
    if(tableItems2.length > 0){
      myReg = this.emailReg(tableItems2);

    }
    if(!myReg){
      helper.showError('请输入正确的邮箱格式!');
      return
    }
    resultList.push(...tableItems2);
    const {onOkFunc, onClose, addKey, value} = this.props;
    if(resultList.length <= 0) {
      helper.showError('请先选择相关人员');
      return;
    }
    onClose();
    return onOkFunc(this.toSaveList(resultList), addKey, value);
  };

  onCancel = () => {
    const {onOkFunc, onClose} = this.props;
    onClose();
    onOkFunc(false);
  };

  getProps = () => {
    const {title, footer} = this.props;
    return {
      title,
      onOk: this.onOk,
      onCancel: this.onCancel,
      width: 910,
      visible: true,
      maskClosable: false,
      okText: footer.ok,
      cancelText: footer.cancel
    };
  };

  onClickTable2 = (key) => {
    let tableItems2 = this.state.tableItems2;

    switch (key){
      case 'add':{
        tableItems2.push({});
        break
      }
      case 'delete':{
        tableItems2 = tableItems2.filter(item => !item.checked);
        break
      }
      default:
        return
    }
    this.setState({tableItems2})
  };

  onCheckTable2 = (rowIndex, keyName, checked) => {
    const tableItems2 = this.state.tableItems2;
    if(rowIndex == -1){
      tableItems2.forEach((item, index) => {
        tableItems2[index].checked = checked
      });
    }else {
      tableItems2[rowIndex].checked = checked;
    }
    this.setState({tableItems2})
  };

  onContentChange  = (rowIndex, keyName, value) => {
    let tableItems2 = this.state.tableItems2;
    tableItems2[rowIndex] = {
      ...tableItems2[rowIndex],
      [keyName]: value
    };
    this.setState({
      tableItems2

    });
  };

  // 显示标题
  toTitle = (title) => (
    <div
      role={'title'}
      className={`ant-modal-header ${s.toTitle}`}
    >
      <span className={`ant-modal-title ${s.title}`}>{title}</span>
    </div>
  );



  toBar(){
    const props = {
      buttons: table2Cols.buttons,
      option: {bsSize: 'small'},
      onClick:this.onClickTable2
    };
    return <div role="bar"><SuperToolbar {...props} /></div>;
  }

  toTable2(){
    const props = {
      cols: table2Cols.tableCols,
      items: this.state.tableItems2,
      callback: {
        onCheck: this.onCheckTable2,
        onContentChange:this.onContentChange
      }
    };
    return <div><SuperTable2 {...props} /></div>;
  }


  render() {
    const {tableCols} = this.props;
    return (
      <ModalWithDrag {...this.getProps()}>
        <div className={s.root}>
        {this.toSearch('tableItems')}
        {this.toTable(tableCols, JSON.parse(JSON.stringify(this.state.tableItems)), 'tableItems')}
        <Title title="临时邮件输入"   role={'title'}/>
        {this.toBar()}
        {this.toTable2()}
        </div>
      </ModalWithDrag>

    );
  }
}

export default withStyles(s)(UserAddDialog);
