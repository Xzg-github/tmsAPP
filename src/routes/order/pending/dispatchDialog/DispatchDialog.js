import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {ModalWithDrag, Title} from '../../../../components';
import s from './DispatchDialog.less';
import {Checkbox} from 'antd';
const CheckboxGroup = Checkbox.Group;

class DispatchDialog extends React.Component {

  toSection = ({title, options=[]}, index) => {
    const {value=[], onChange} = this.props;
    return (
      <div key={index}>
        <Title title={title} />
        <CheckboxGroup value={value} options={options} onChange={onChange} />
      </div>
    )
  };

  toBody = () => {
    const {sections} = this.props;
    return (
      <div className={s.root}>
        {sections.map(this.toSection)}
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

export default withStyles(s)(DispatchDialog);
