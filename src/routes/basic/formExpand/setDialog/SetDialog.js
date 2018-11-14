import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {SuperToolbar, SuperTable, ModalWithDrag} from '../../../../components';
import s from './SetDialog.less';

class SetDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    ok: PropTypes.string,
    cancel: PropTypes.string,
    buttons: PropTypes.array,
    tableCols: PropTypes.array,
    tableItems: PropTypes.array,
    onClick: PropTypes.func,
    onCancel: PropTypes.func,
    onOk: PropTypes.func
  };

  toTable = () => {
    const {tableCols, tableItems, onCheck} = this.props;
    const props = {
      items: tableItems,
      cols: tableCols,
      checkbox: true,
      index: true,
      maxHeight: '400px',
      callback: {
        onCheck
      }
    };
    return <SuperTable {...props} /> ;
  };

  toToolbar = () => {
    const {buttons, onClick} = this.props;
    const props = {
      buttons,
      onClick
    };
    return <SuperToolbar {...props} /> ;
  };

  toBody = () => {
    return (
      <div className={s.root}>
        {this.toToolbar()}
        {this.toTable()}
      </div>
    );
  };

  getProps = () => {
    const {title, ok, cancel, onCancel, onOk, afterClose, res, visible} = this.props;
    return {
      title,
      okText: ok,
      cancelText: cancel,
      onCancel,
      onOk,
      visible,
      afterClose: () => {afterClose(res)},
      width: 800,
      maskClosable: false
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.toBody()}
      </ModalWithDrag>
    );
  }
}

export default withStyles(s)(SetDialog);
