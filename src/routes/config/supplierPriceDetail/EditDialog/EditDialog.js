import React, { PropTypes } from 'react';
import { Indent, SuperForm, ModalWithDrag} from '../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditDialog.less';

class EditDialog extends React.Component {

  constructor (props) {
    super(props);
  }

  onOk = () => {
    const {onOk, afterClose} = this.props;
    onOk && onOk(afterClose);
  }

  toSuperForm = () => {
    const {controls, value, valid, onChange, onSearch, onExitValid, checkable, onCheckItem} = this.props;
    const props = {
      controls,
      value,
      valid,
      onChange,
      onSearch,
      onExitValid,
      checkable,
      onCheckItem,
      container: false
    };
    return <SuperForm {...props}/>
  }

  getProps = () => {
    const {title, afterClose} = this.props;
    return {
      title,
      visible: true,
      width: 1000,
      maskClosable: false,
      confirmLoading: false,
      onOk: this.onOk,
      onCancel: afterClose
    }
  }

  render() {
    const className = this.props.type < 3 ? s.modal_content : '';
    return (
      <ModalWithDrag {...this.getProps()}>
        <Indent className={className}>{this.toSuperForm()}</Indent>
      </ModalWithDrag>
    )
  }
}

export default withStyles(s)(EditDialog);
