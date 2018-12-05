import React, { PropTypes } from 'react';
import { Card, SuperTable2, SuperToolbar, ModalWithDrag} from '../../../../../components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../EditPage.less';

class MultipleDialog extends React.Component {

  constructor (props) {
    super(props);
  }

  onOk = () => {
    const {onOk, afterClose} = this.props;
    onOk && onOk(afterClose);
  }

  toToolbar = () => {
    const {buttons, onClick} = this.props;
    return <SuperToolbar {...{buttons, onClick}}/>
  }

  toTable = () => {
    const {cols, items, valid, onExitValid, onChange, onSearch, onCheck} = this.props;
    const props = {
      cols,
      items,
      valid,
      maxHeight: "400px",
      callback: {
        onExitValid, onSearch,  onCheck,
        onContentChange: onChange
      }
    }
    return <SuperTable2 {...props}/>
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
      {this.toToolbar()}
        <Card>
          {this.toTable()}
        </Card>
      </ModalWithDrag>
    )
  }
}

export default withStyles(s)(MultipleDialog);
