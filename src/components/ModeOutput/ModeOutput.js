import React, { PropTypes } from 'react';
import { Button, Input } from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ModeOutput.less';
import SuperTable from '../SuperTable';
import SuperForm from '../SuperForm';
import ModalWithDrag from '../ModalWithDrag';
import { fetchJson, postOption, showError, showSuccessMsg } from '../../common/common';
import addDefaultOutput from '../../routes/basic/defaultOutput/addDefaultOutput/addDefaultOutput'
import showPopup from '../../standard-business/showPopup';
//import getModeCode from '../../routes/track/execution/OrderPage/getModeCode';

const tableCols = [
  { key: 'reportName', title: '模板' },
];

const formControls = [
  { key: 'outputType', title: '输出格式', type: 'select', options: [{ value: 'HTML', title: 'HTML' }, { value: 'WORD', title: 'WORD' }, { value: 'PDF', title: 'PDF' }] },
  { key: 'email', title: '邮件', type: 'text' },
];

/**
 * onCancel: 关闭窗口事件，原型func(bool) {this.setState({isShow: bool})}
 * isShow: 窗口是否展示，bool
 * modeCode: 模板类型，string
 * paramid: 记录id，string
 * tableCols: 可选，没传的使用默认
 * formControls: 可选，没传的使用默认
 * modeKey: 可选，任务操作输出的的url不一样，key是为了做兼容
 */

class ModeOutput extends React.Component {
  static propTypes = {
    onCancel: PropTypes.func,
    isShow: PropTypes.bool.isRequired,
    modeCode: PropTypes.string.isRequired,
    modeKey: PropTypes.string,
    paramid: PropTypes.array.isRequired,
    tableCols: PropTypes.array,
    tableItems: PropTypes.array,
    formControls: PropTypes.array,
  };

  state = {
    reportName: '',
    tableItems: [],
    fromData: { outputType: 'HTML' },
  };

  async componentDidMount() {   // 初始化列表
    const {modeCode,filter} = this.props;
    const url = '/api/config/mode_output/getModeList';
    const modeList = await fetchJson(url, postOption({modeCode,filter}));
    if(modeList.returnCode !== 0){
      showError(modeList.returnMsg);
      this.setState({ tableItems:[]});
      return;
    }
    if(modeList.result.length >0){
      modeList.result[0].checked = modeList.result[0].defaultOutput;
      this.setState({ tableItems:modeList.result});
    }
  }

  onCancel = () => {
    const {onClose, onCancel} = this.props;
    if (onClose) {
      onClose();
    }else if (onCancel) {
      onCancel();
    }
  };

  createHtmlUrl(paramid) {  //生成输出模板的url
    let htmlUrl = '';
    let url = [];

    const formData = this.state.fromData;
    const reportName = this.state.reportName;
    const filterItems = this.reportNameFilter(this.state.tableItems, reportName);

    const falg = filterItems.length< this.state.tableItems.length? true:false;
    let tableItems = falg ? filterItems :this.state.tableItems ;
    let a = 0;
    tableItems.forEach((item,index) => {

      if (item.checked && formData.outputType && typeof formData.outputType !== 'string') {
        htmlUrl = `/api/proxy/report_service/report/output/${formData.outputType[a]}/${item.id}/${paramid}`;
        a++;
        url.push(htmlUrl)
      }else if(item.checked && formData.outputType && formData.outputType !== ''){
        htmlUrl = `/api/proxy/report_service/report/output/${formData.outputType}/${item.id}/${paramid}`;
        a++;
        url.push(htmlUrl)
      }

    });
    return url;
  }

  reportNameFilter(tableItems, reportName) {   // 通过模板名称过滤列表
    let newTableItems = [];
    if (reportName === '' || !reportName) {
      return tableItems;
    } else {
      tableItems.forEach((item) => {
        if (item.reportName.toLowerCase().indexOf(reportName.toLowerCase()) > -1) {
          newTableItems.push(item);
        }
      });
      return newTableItems;
    }
  }

  output = () => {
    const paramids = this.props.paramid;
    paramids.forEach (paramid => {
      const url = this.createHtmlUrl(paramid);
      if (url.length !== 0) {
        url.forEach(item => {
          window.open(item)
        })
      } else {
        showError('请选择输出模板');
      }
    });
  };

  createSendEmail = (paramid) => {
    const url = '/api/config/mode_output/sendmail';
    const reportName = this.state.reportName;
    const filterItems = this.reportNameFilter(this.state.tableItems, reportName);
    const falg =filterItems.length< this.state.tableItems.length?true:false;
    let tableItems = falg ? filterItems :this.state.tableItems ;

    const formData = this.state.fromData;
    const myreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;  // 邮箱格式校验正则
    let mode = [];
    tableItems.forEach((item) => {
      if (item.checked) {
        mode.push(item);
      }
    });
    if (mode.length !== 1) {
      showError('请选择一个输出模板');
      return;
    }
    if (!myreg.test(formData.email)) {
      showError('请输入正确的邮箱格式!');
      return;
    }
    const postData = {
      email: formData.email,
      id: mode[0].id,
      outputType: typeof formData.outputType !== 'string' ? formData.outputType[0] : formData.outputType,
      paramid: paramid,
      subject: mode[0].reportName,
    };
    fetchJson(url, postOption(postData)).then(() => {
      showSuccessMsg('邮件发出成功!');
      this.onCancel();
    });
  };

  sendEmail = () => {
    const paramids = this.props.paramid;
    paramids.forEach (paramid => {
      this.createSendEmail(paramid)
    });

  };

  defaultOutput =() => {
    addDefaultOutput();
  };

  commonOutput = () => {
    const reportName = this.state.reportName;
    const filterItems = this.reportNameFilter(this.state.tableItems, reportName);
    const falg =filterItems.length< this.state.tableItems.length?true:false;
    let tableItems = falg ? filterItems :this.state.tableItems ;
    let mode = [];
    tableItems.forEach((item) => {
      if (item.checked) {
        mode.push(item);
      }
    });
    if (mode.length !== 1) {
      showError('请选择一个输出模板');
      return;
    }
    let arr = [];
    arr.push({
      reportTypeConfigId:mode[0].reportTypeConfigId,
      reportConfigId:mode[0].id
    });
    let url = '/api/basic/commonOutput/add';

    fetchJson(url, postOption(arr)).then((result) => {
      showSuccessMsg(result.returnMsg);
    });
  };



  onCheck = (isAll, checked, rowIndex) => {
    // console.log(isAll, checked, rowIndex);
    let tableItems = JSON.parse(JSON.stringify(this.state.tableItems));
    let newRowIndex = null;
    const reportName = JSON.parse(JSON.stringify(this.state.reportName));
    const filterItems = this.reportNameFilter(tableItems, reportName);
    const falg=filterItems.length<tableItems.length?true:false;
    tableItems.forEach((item, index) => {
      /*  if (item.checked) {
          tableItems[index] = { ...tableItems[index], checked: false }
        }*/
      if(rowIndex === -1){
        tableItems[index].checked = checked
      }

      if(!isAll&&falg&&item.id==filterItems[rowIndex].id&&checked){
        newRowIndex=index
      } else if(isAll&&falg&&checked&&item.id==filterItems[0].id){
        newRowIndex = index;
      }else if (!isAll&&!falg&&item.id === filterItems[rowIndex].id&&checked) {
        newRowIndex = index;
      } else if (isAll&&!falg&&!checked) {
        newRowIndex = index;
      }else if(isAll&&!falg&&checked){
        newRowIndex = index;
      };
    });
    if(rowIndex !== -1){
      tableItems[rowIndex].checked = checked;
      filterItems[rowIndex].checked = checked;
    }
    tableItems[newRowIndex] = { ...tableItems[newRowIndex], checked };
    let spe;
    if(!falg){
      spe = tableItems.filter(x=>x.checked && x.outputType && x.outputType != "");
    }else {
      spe = filterItems.filter(x=>x.checked && x.outputType && x.outputType != "");
    }
    let outTypeItems = [];
    spe.forEach(item => {
      outTypeItems.push(item.outputType)
    });
    if(spe.length){
      const obj = this.state.fromData;
      this.setState({ fromData: {
        ...obj,
        outputType: outTypeItems[outTypeItems.length-1]
      }, tableItems: tableItems  });
    }else{
      const obj = this.state.fromData;
      this.setState({ fromData: {
        ...obj,
        outputType: "HTML"
      }, tableItems: tableItems });
    }
  };

  onChange = (key, value) => {
    const obj = this.state.fromData;
    this.setState({
      fromData: {
        ...obj,
        [key]: value
      }
    });
    //console.log(obj, this.state.fromData, key, value, this.props.formControls);
  };

  onSearchChange = (e) => {     // 搜索框值修改回调
    let tableItems = this.state.tableItems;
    tableItems.forEach(x=>x.checked=false);
    this.setState({ reportName: e.target.value ,tableItems});
    //console.log(this.reportNameFilter(this.state.tableItems, this.state.reportName));
  };

  renderSearchInput() {
    const props = {
      placeholder: "模板名称搜索",
      style: { width: '100%', marginBottom: '10px' },
      value: this.state.reportName,
      onChange: this.onSearchChange,
    };
    return <Input {...props} />;
  }

  renderSuperTable() {
    let filterItems = this.reportNameFilter(this.state.tableItems, this.state.reportName);
    //console.log(filterItems);
    const props = {
      cols: this.props.tableCols || tableCols,
      items: filterItems || [],
      callback: {
        onCheck: this.onCheck,
      },
    };
    return <div className={s.table_wrap}><SuperTable {...props} /></div>;
  }

  renderSuperForm() {
    let fromData = JSON.parse(JSON.stringify(this.state.fromData));
    // console.log(fromData);
    // if(fromData.length > 1){
    //   console.log(1);
    // }
    const props = {
      controls: this.props.formControls || formControls,
      value: this.state.fromData,
      colNum: 2,
      onChange: this.onChange,
    };
    return <div className={s.form}><SuperForm {...props} /></div>;
  }


  render() {
    return (
      <ModalWithDrag
        wrapClassName="ModeOutput"
        visible={this.props.isShow}
        closable={true}
        onCancel={() => this.onCancel()}
        title='模板输出'
        width='350px'
        footer={
          <div style={{ textAlign: 'center' }}>
            {this.props.paramid.length == 1 &&
            <Button size='small' onClick={() => this.defaultOutput()}>默认输出</Button>
            }
            {this.props.paramid.length == 1 &&
            <Button size='small' onClick={() => this.commonOutput()}>设为快捷</Button>
            }
            <Button size='small' onClick={() => this.output()}>输出</Button>
            <Button size='small' onClick={() => this.sendEmail()}>发送邮件</Button>
          </div>
        }
      >
        {this.renderSearchInput()}
        {this.renderSuperTable()}
        {this.renderSuperForm()}
      </ModalWithDrag>
    );
  }
}

const showOutputDialog = (checkItems=[], key='') => {
  let paramid = checkItems.map(o => o.guid);
  let filter = checkItems.length === 1 ? checkItems[0].reportParam || {} : {};
  //const modeCode = getModeCode[key] || key;
  const modeCode = key;
  const props = {
    title: '模板输出',
    isShow: true,
    modeCode,
    modeKey: key,
    paramid,
    filter
  };
  return showPopup(ModeOutput, props);
};

export default withStyles(s)(ModeOutput);
export {showOutputDialog};
