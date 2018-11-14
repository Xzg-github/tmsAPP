import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Input } from 'antd';
import {SuperTable, ModalWithDrag} from '../../../../components/index';


class EditDialogPage extends React.Component {

  renderSuperTable() {
    const {tableCols,tableItems,onCheck} = this.props;
    const props = {
      cols:  tableCols,
      items: tableItems ,
      maxHeight: '300px',
      callback: {
        onCheck: onCheck,
      },
    };
    return <SuperTable {...props} />
  }


  renderSearchInput = () => {
    const {formValue,onChange} = this.props;
    const props = {
      placeholder: "数据类型名称",
      style: { width: '100%', marginBottom: '10px' },
      value: formValue,
      onChange: onChange,
    };
    return <Input {...props} />;
  };

  getProps = () => {
    const {onOk, onCancel, title,label} = this.props;
    return {
      onOk, onCancel,
      title: title ,
      visible: true,
      maskClosable: false,
      width: 400,
      okText: label.ok,
      cancelText: label.cancel,
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.renderSearchInput()}
        {this.renderSuperTable()}
      </ModalWithDrag>
    );
  }
}

export default withStyles()(EditDialogPage);
