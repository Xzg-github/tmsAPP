import React, { PropTypes } from 'react';
import { Indent, SuperTable2, SuperToolbar, ModalWithDrag} from '../../../../../components';
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
    const {buttons, onClick, dialogType} = this.props;
    const btns = buttons.filter(o => o.showIn ? o.showIn.includes(dialogType): true);
    return <SuperToolbar {...{buttons: btns, onClick}}/>
  }

  toTable = () => {
    const {cols, items, valid, onExitValid, onChange, onSearch, onCheck} = this.props;
    const props = {
      cols: cols.filter(o => !o.hide),
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
      <div className={s.marginBottomSM}>{this.toToolbar()}</div>
      {this.toTable()}
      </ModalWithDrag>
    )
  }
}

export default withStyles(s)(MultipleDialog);
