import React, { PropTypes } from 'react';
import { Indent, SuperForm, ModalWithDrag} from '../../../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../Freight.less';

class EditDialog extends React.Component {

  constructor (props) {
    super(props);
  }

  onOk = () => {
    const {onOk, afterClose} = this.props;
    onOk && onOk(afterClose);
  }

  toSuperForm = () => {
    const {controls, value, valid, onChange, onSearch, onExitValid} = this.props;
    const props = {
      controls,
      value,
      valid,
      onChange,
      onSearch,
      onExitValid,
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
    return (
      <ModalWithDrag {...this.getProps()}>
        <Indent>{this.toSuperForm()}</Indent>
      </ModalWithDrag>
    )
  }
}

export default withStyles(s)(EditDialog);
