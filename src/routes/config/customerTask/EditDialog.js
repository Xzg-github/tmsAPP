import React from 'react';
import {ModalWithDrag, SuperForm} from '../../../components';
import {Checkbox} from 'antd';
import Title from "../../../components/Title";
import s from "./EditDialog.less";
import withStyles from "isomorphic-style-loader/lib/withStyles";
const CheckboxGroup = Checkbox.Group;

class EditDialog extends React.Component {

  toSection = ({title, options=[]}, index) => {
    const {value=[], onCheckboxChange} = this.props;
    return (
      <div key={index}>
        <Title title={title} />
        <CheckboxGroup value={value} options={options} onChange={onCheckboxChange} />
      </div>
    )
  };

  toBody = () => {
    const {sections, controls, formValue, valid, onChange, onSearch, onExitValid} = this.props;
    const formProps = {
      controls,
      valid,
      value: formValue,
      container: true,
      onChange, onSearch, onExitValid
    };
    return (
      <div className={s.root}>
        <div>
          <Title title="基本信息" />
          <SuperForm {...formProps}/>
        </div>
        {sections.map(this.toSection)}
      </div>
    );
  };

  getProps = () => {
    const {title, type, visible, confirmLoading, res, onCancel, onOk, afterClose} = this.props;
    const extra = type === 2 ? {footer: null} : {};
    return {
      title,
      visible,
      onCancel,
      onOk,
      afterClose: () => afterClose(res),
      width: 900,
      maskClosable: false,
      confirmLoading,
      ...extra
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

export default withStyles(s)(EditDialog);
