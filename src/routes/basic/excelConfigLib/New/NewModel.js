import React, { PropTypes } from 'react';
import {Row, Col} from 'antd';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './NewModel.less';
import {getObject} from '../../../../common/common';
import {SuperToolbar, Card, SuperForm, ModalWithDrag} from '../../../../components';
import SuperTable from '../components/SuperTable/SuperTable';
import UploadFile from '../components/UploadFile/UploadFile';
import ConfirmDialog from '../../../../components/ConfirmDialog';

const TOOLBAR_EVENTS = ['onClick']; // 工具栏点击事件

const props = {
  tableCols: PropTypes.array,
  tableItems: PropTypes.array,
  buttons: PropTypes.array,
  filters: PropTypes.array,
  tableCols1: PropTypes.array,
  tableItems1: PropTypes.array,
  onCancel: PropTypes.func,
  visible: PropTypes.bool,
  buttons1: PropTypes.array,
  buttons2: PropTypes.array,
  confirmType: PropTypes.string,
  controls: PropTypes.array,
  value: PropTypes.object,
  valid: PropTypes.bool,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onExitValid: PropTypes.func,
};


class NewModel extends React.Component {
  static propTypes = props;
  static PROPS = Object.keys(props);
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

  // getInputValue = (key) => {
  //   return this.props[key];
  // };
  //
  // toInput = ({ key, title, type, disabled = false }) => {
  //   return (
  //     <div key={key}>
  //       <labe>{title}</labe>
  //       <Input
  //         type={type}
  //         disabled={disabled}
  //         data-id={key}
  //         value={this.getInputValue(key)}
  //         onChange={(e) => { this.handleChange(0, e); }}
  //         onBlur={(e) => { this.handleChange(1, e); }}
  //       />
  //     </div>
  //   )
  // };
  //
  // handleChange = (type, e) => {
  //   const { value } = e.target;
  //   const key = e.currentTarget.dataset.id;
  //   this.props.onModelChange({ [key]: value }, type);
  // };
  // toForm = () => {   // 表单
  //   const { controls = [] } = this.props;
  //   console.log(controls)
  //   return (
  //     controls.map(this.toInput)
  //   );
  // };

  toForm = () => {
    const {controls, value, onChange, onSearch, onExitValid, valid} = this.props;
    const props = {
      controls,
      value,
      size: 'small',
      onChange,
      onSearch,
      onExitValid,
      valid
    };
    return <div role="form"><SuperForm {...props} bsSize='small' colNum={3}/></div>;
  };

  toTable = (cols, items, callback) => { // 列表
    const option = { index: true, checkbox: true };
    const props = { cols, items, option, callback };
    return <div role="lta"><SuperTable {...props} /></div>;
  };

  toRightTable = (cols, items, callback) => { // 列表
    const option = { index: true, checkbox: true };
    const props = { cols, items, option, callback };
    return <div role="rta"><SuperTable {...props} /></div>;
  };

  toSuperToolbar = (buttons) => {
    const option = { bsSize: 'small' };
    const props = { buttons, option, callback: getObject(this.props, TOOLBAR_EVENTS) };
    return <div role="st"><SuperToolbar {...props} /></div>;
  };

  toSuperToolbar1 = (buttons) => {
    const option = { bsSize: 'small' };
    const props = { buttons, option, callback: getObject(this.props, TOOLBAR_EVENTS) };
    return <div role="st1"><SuperToolbar {...props} /></div>;
  };

  toTopToolbar = (buttons) => {
    const option = { bsSize: 'small' };
    const props = { buttons, option, callback: getObject(this.props, TOOLBAR_EVENTS) };
    return <div role="tb"><SuperToolbar {...props} /></div>;
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

  render() {
    const { tableCols, tableItems, tableCols1, tableItems1, onCancel, visible, buttons, buttons1, buttons2 } = this.props;
    const events = getObject(this.props, ['onCellClick', 'onContentChange']);
    const { onContentChange1: onContentChange, onCheck } = getObject(this.props, ['onContentChange1', 'onCheck']);
    const events1 = { onContentChange, onCheck };
    return (
      <ModalWithDrag
        title="新增"
        width={'95%'}
        style={{ minWidth: '1250px' }}
        visible={visible}
        onCancel={onCancel}
        footer={null}
      >
        <div className={s.root}>
          <Card>
            {this.toForm()}
            {this.toSuperToolbar(buttons)}
            {this.toSuperToolbar1(buttons2)}
            <Row >
              <Col span={11}> {this.toTable(tableCols, tableItems, events)}</Col>
              <Col span={1}> </Col>
              <Col span={11}>{this.toTopToolbar(buttons1)}{this.toRightTable(tableCols1, tableItems1, events1)}</Col>
            </Row>
          </Card>
          {this.toUploadFile(this.props)}
        </div>
        {this.state.showConfirm && this.toConfirmDialog()}
      </ModalWithDrag>
    )
  }
}
export default withStyles(s)(NewModel);
