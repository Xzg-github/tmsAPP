import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Search, SuperTable2, ModalWithDrag} from '../../../../components';
import s from './SupplierDialog.less';

class SupplierDialog extends React.Component {

  toSearch = () => {
    const {filters, searchConfig, searchData, onChange, onClick} = this.props;
    const props = {
      filters,
      data: searchData,
      config: searchConfig,
      onChange,
      onClick
    };
    return <Search {...props}/>;
  };

  toTable = () => {
    const {cols, items, onContentChange, onSearch, onCheck} = this.props;
    const props = {
      cols,
      items,
      maxHeight: `450px`,
      callback: {
        onContentChange, onCheck
      }
    };
    return <SuperTable2 {...props} /> ;
  };

  toBody = () => {
    return (
      <div className={s.root}>
        {this.toSearch()}
        {this.toTable()}
      </div>
    );
  };

  getProps = () => {
    const {title, ok, cancel, visible, confirmLoading, res, onCancel, onOk, afterClose} = this.props;
    return {
      title,
      visible,
      onCancel,
      onOk,
      afterClose: () => afterClose(res),
      okText: ok,
      cancelText: cancel,
      width: 900,
      maskClosable: false,
      confirmLoading
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

export default withStyles(s)(SupplierDialog);
