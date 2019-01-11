import React from 'react';
import {Input, DatePicker} from 'antd';
import Map, {getDistrict} from '../../../../components/ElectricFence/Map';
import ModalWithDrag from '../../../../components/ModalWithDrag';
import showPopup from '../../../../standard-business/showPopup';
import helper from '../../../../common/common';
import moment from 'moment';

const Search = Input.Search;

class UpdateDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      carInfoId: props.carInfoId,
      transportOrderId: props.id,
      center: (props.longitude && props.latitude) ? {lng: props.longitude, lat: props.latitude} : null,
      position: props.position,
      planArrivalTime: props.planArrivalTime,
      current: '',
      confirmLoading: false
    };
    this.onOk = this.onOk.bind(this);
  }

  async onOk() {
    if (!this.state.center || !this.state.planArrivalTime || !this.state.position) {
      return helper.showError(`请将信息补充完整`);
    }
    this.setState({...this.state, confirmLoading: true});
    const district = await getDistrict(this.state.center.lat, this.state.center.lng);
    if (!district) {
      this.setState({...this.state, confirmLoading: false});
      return helper.showError(`获取省、市、区失败`);
    }
    const body = helper.getObject(this.state, ['carInfoId', 'transportOrderId', 'position', 'planArrivalTime']);
    body.latitude = this.state.center.lat;
    body.longitude = this.state.center.lng;
    Object.assign(body, district);
    const url = `/api/track/track_transport/update`;
    const {returnCode, returnMsg} = await helper.fetchJson(url, helper.postOption(body));
    if (returnCode !== 0) {
      this.setState({...this.state, confirmLoading: false});
      return helper.showError(returnMsg);
    }
    this.props.onClose(true);
  };

  onCancel = () => {
    this.props.onClose();
  };

  onSearch = (value) => {
    if (value !== this.state.position) {
      this.setState({...this.state, position: value, center: null, current: ''});
    } else if (this.state.current) {
      if (value !== this.state.current) {
        this.setState({...this.state, center: null, current: ''});
      }
    }
  };

  searchProps = (value, width) => {
    return {
      defaultValue: value,
      size: 'small',
      style: {width, marginRight: 10},
      onSearch: this.onSearch
    };
  };

  inputProps = (value, width) => {
    return {
      value,
      title: value,
      readOnly: true,
      size: 'small',
      style: {width, marginRight: 10, backgroundColor: '#f0f0f0'},
    };
  };

  mapProps = () => {
    return {
      address: this.state.position || '广东省深圳市南山区南山智园A3',
      center: this.state.center,
      level: 17,
      height: 500,
      onCenterChange: (center, current) => this.setState({...this.state, center, current}),
      onPosition: (center) => this.setState({...this.state, center})
    };
  };

  dateProps = (value, width) => {
    return {
      value: !value ? undefined : moment(value),
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      size: 'small',
      style: {width, marginRight: 10},
      onChange: (value, dateString) => this.setState({...this.state, planArrivalTime: dateString})
    };
  };

  getProps = () => {
    return {
      title: '位置更新',
      visible: true,
      width: 910,
      maskClosable: false,
      confirmLoading: this.state.confirmLoading,
      onOk: this.onOk,
      onCancel: this.onCancel
    };
  };

  render() {
    const {lng='', lat=''} = this.state.center || {};
    const style = {marginRight: 5};
    return (
      <ModalWithDrag {...this.getProps()}>
        <div style={{marginBottom: 5}}>
          <span style={style}>详细地址</span>
          <Search {...this.searchProps(this.state.position, 200)}/>
          <span style={style}>计划到达时间</span>
          <DatePicker {...this.dateProps(this.state.planArrivalTime, 200)}/>
          <span style={style}>经度</span>
          <Input {...this.inputProps(lng, 90)}/>
          <span style={style}>纬度</span>
          <Input {...this.inputProps(lat, 90)}/>
        </div>
        <Map {...this.mapProps()} />
      </ModalWithDrag>
    );
  }
}

/*
* 功能：更新位置对话框
* 参数：data: 【必需】待更新位置的记录信息
* 返回值：成功返回true，取消或关闭时返回空
*/
export default async (data) => {
  return showPopup(UpdateDialog, data);
};
