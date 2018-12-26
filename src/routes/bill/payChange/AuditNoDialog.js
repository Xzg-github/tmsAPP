import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {ModalWithDrag} from '../../../components';
import {showError} from '../../../common/common';
import s from './AuditNoDialog.less';
import showPopup from '../../../standard-business/showPopup';
import {Input,Form} from 'antd';
const FormItem = Form.Item;

class AuditNoDialog extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      reason: ''
    }
  }

  onChange = (e) => {
    this.setState({reason: e.target.value});
  }

  onOk = () => {
    const {onAuditNoOk,onClose} = this.props;
    const {reason=''} = this.state;
    if(reason.replace(/(^\s*)|(\s*$)/g,'') ==='') return showError('请填写不通过原因！');
    onAuditNoOk && onAuditNoOk(this.state.reason);
    onClose();
  }

  getProps = () => {
    const {show, title, onClose, confirmLoading=false} = this.props;
    return {
      onOk: this.onOk,
      onCancel: onClose,
      className: s.root,
      title: title ,
      visible: show,
      maskClosable: false,
      width: 600,
      confirmLoading
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        <FormItem label='原因说明'>
          <Input onChange={this.onChange}/>
        </FormItem>
      </ModalWithDrag>
    );
  }
}

const showAuditNoDialog = (onAuditNoOk) => {
  const props = {
    show: true,
    title: '审核不通过',
    onAuditNoOk
  };
  showPopup(withStyles(s)(AuditNoDialog), props);
};

export {showAuditNoDialog};
