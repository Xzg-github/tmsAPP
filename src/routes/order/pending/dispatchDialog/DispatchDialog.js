import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {ModalWithDrag, Title, SuperForm} from '../../../../components';
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

  toForm = () => {
    const {defaultSet={}, controls} = this.props;
    return (
      <div>
        <Title title='基本信息' />
        <SuperForm {...{controls, value:defaultSet}}/>
      </div>
    )
  };

  toBody = () => {
    const {sections} = this.props;
    return (
      <div className={s.root}>
        {this.toForm()}
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
