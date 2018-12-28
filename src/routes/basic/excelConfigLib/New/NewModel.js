import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {getObject} from '../../../../common/common';
import {SuperToolbar, Indent, SuperForm, Title, SuperTab2, SuperTable2} from '../../../../components';
import UploadFile from '../UploadFile/UploadFile';
import ConfirmDialog from '../../../../components/ConfirmDialog';

const TOOLBAR_EVENTS = ['onClick']; // 工具栏点击事件

/*const props = {
  tableCols: PropTypes.array,
  buttons: PropTypes.array,
  buttons1: PropTypes.array,
  onCancel: PropTypes.func,
  visible: PropTypes.bool,
  confirmType: PropTypes.string,
  controls: PropTypes.array,
  controls1: PropTypes.array,
  value: PropTypes.object,
  valid: PropTypes.bool,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onExitValid: PropTypes.func,
};*/

class NewModel extends React.Component {
  /*static propTypes = props;
  static PROPS = Object.keys(props);*/
  state = {
    value: '',
    showConfirm: false,
  };
  componentWillReceiveProps(nextProps) {
    const { confirmType } = nextProps;
    if (!confirmType) {
      if (this.state.showConfirm) {
        this.setState({ showConfirm: false });
      }
    } else {
      this.setState({ showConfirm: true });
    }
  }
  getContainer = () => {
    return ReactDOM.findDOMNode(this);
  };

  toForm = () => {
    const {controls, value, onChange, onSearch, onExitValid, valid} = this.props;
    const props = {
      controls: controls,
      value,
      onChange,
      onSearch,
      onExitValid,
      valid
    };
    return <div style ={{paddingLeft:'15px',marginBottom: '10px'}}><SuperForm {...props} /></div>;
  };
  toForm1 = () => {
    const {controls1, state, onChange, onSearch, onExitValid, valid, CURRNT_TABLE_CODE} = this.props;
    const props = {
      controls: controls1,
      value: state[CURRNT_TABLE_CODE],
      onChange,
      onSearch,
      onExitValid,
      valid
    };
    return <div style ={{margin: '15px'}}><SuperForm {...props} /></div>;
  };

  toTable = (cols, items, callback) => { // 列表
    const option = { index: true, checkbox: true };
    const props = { cols, items, option, callback };
    return <div style ={{marginTop: '5px'}}><SuperTable2 {...props} /></div>;
  };

  toSuperToolbar = (buttons) => {
    const props = { buttons, callback: getObject(this.props, TOOLBAR_EVENTS) };
    return <div  style ={{marginTop: '10px'}}><SuperToolbar {...props} /></div>;
  };

  toToolbar = (buttons) => {
    const props = { buttons, size: 'default', callback: getObject(this.props, TOOLBAR_EVENTS) };
    return <div style = {{marginTop: '20px', marginBottom: '20px', textAlign: 'center'}}><SuperToolbar {...props} /></div>;
  };

  toTab = () => {
    const {CURRNT_TABLE_CODE, onTabChange, tabs} = this.props;
    const props = {
      tabs: tabs,
      activeKey: CURRNT_TABLE_CODE,
      onTabChange
    };
    return <SuperTab2 {...props}/>;
  };

  toUploadFile = (data) => {
    const { visible1: visible, onCancel1: onCancel, onUpload } = data;
    const props = {
      visible,
      onCancel,
      onUpload,
    };
    if (visible) {
      return (
        <UploadFile {...props} />
      );
    }
  };
  toConfirmDialog = () => {
    const { ConfirmDialog: props } = this.props;
    return <ConfirmDialog {...props} />
  };

  toShowButton = (buttons) => {
    const {value} = this.props;
    const props = { buttons, size: 'default', callback: getObject(this.props, TOOLBAR_EVENTS) };
    if(value.url){
      return(
        <div style = {{marginTop: '15px'}}>
          <Title title="上传模板信息" />
          <div style = {{marginTop: '10px',marginLeft: '15px', textAlign: 'left'}}>
            <SuperToolbar {...props} />
          </div>
        </div>
      )
    }
  };

  render() {
    const { tableCols, buttons, buttons1,buttons2, state, CURRNT_TABLE_CODE} = this.props;
    const { onContentChange: onContentChange, onCheck } = getObject(this.props, ['onContentChange', 'onCheck']);
    const events1 = { onContentChange, onCheck };
    return (
      <div>
        <div style={{marginLeft: '15px', marginRight: '15px', marginBottom: '15px'}}><Title title= '基本信息' /></div>
           <Indent>{this.toForm()}</Indent>
        <div style={{margin: '15px'}}><Title title= 'Excel模板信息' /></div>
        <Indent>
          {this.toTab()}
          {this.toForm1()}
          {this.toSuperToolbar(buttons)}
          {this.toTable(tableCols, state[CURRNT_TABLE_CODE].mapperList, events1)}
          {this.toShowButton(buttons2)}
          {this.toToolbar(buttons1)}
        </Indent>
        {this.toUploadFile(this.props)}
        {this.state.showConfirm && this.toConfirmDialog()}
      </div>
    )
  }
}
/*export default withStyles(s)(NewModel);*/
export default NewModel;
