import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {SuperTable, ModalWithDrag} from '../../../../components';
import { Checkbox, Input, Select} from 'antd';
import s from './DriverDialog.less';
const Search = Input.Search;
const Option = Select.Option;

class DriverDialog extends React.Component {

  onHandleChange = (changeKey, e) => {
    const {onSearch, data} = this.props;
    let value;
    if (changeKey === 'carModeId') {
      e.target.checked && (value = data.carModeId);
    }else if (changeKey === 'carState') {
      e.target.checked && (value = 'car_state_unuser');
    }else if (changeKey === 'carArea') {
      value = e;
    }
    onSearch(changeKey, value);
  };

  onHandleSearch = (value) => {
    this.props.onSearch('carNumber', value);
  };

  getOptions = (carAreaOptions) => {
    return carAreaOptions.map(item => {
      return <Option key={item.value} value={item.value}>{item.title}</Option>;
    });
  };

  toSearch = () => {
    const {searchData={}, data, carAreaOptions} = this.props;
    return (
      <div role='search'>
        <Checkbox onChange={this.onHandleChange.bind(null, 'carModeId')} checked={searchData['carModeId'] === data.carModeId}>查看车型匹配的车辆</Checkbox>
        <Checkbox onChange={this.onHandleChange.bind(null, 'carState')} checked={searchData['carState'] === 'car_state_unuser'}>查看空闲的车辆</Checkbox>
        <Select
          mode="multiple"
          style={{ width: '300px', marginRight: '5px'}}
          placeholder="车辆标签"
          onChange={this.onHandleChange.bind(null, 'carArea')}
        >
          {this.getOptions(carAreaOptions)}
        </Select>
        <Search
          placeholder="车牌号"
          onSearch={this.onHandleSearch}
        />
      </div>
    );
  };

  toBody = () => {
    const {cols, items, checkedRows, onRadio} = this.props;
    const props = {
      cols, items, checkedRows,
      radio: true,
      isolation: true,
      isPaging: true,
      maxHeight: '450px',
      callback: {
        onRadio
      }
    };
    return (
      <div className={s.root}>
        {this.toSearch()}
        <SuperTable {...props} />
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
      width: 1200,
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

export default withStyles(s)(DriverDialog);
