import React, {PropTypes} from 'react';
import {Input} from 'antd';
import Map from './Map';
import ModalWithDrag from '../ModalWithDrag';

class ElectricFence extends React.Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    center: PropTypes.object,
    onClose: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {center: props.center, current: ''};
  }

  onOk = () => {
    this.props.onClose({address: this.props.address, center: this.state.center});
  };

  onCancel = () => {
    this.props.onClose();
  };

  toInput = (value, width) => {
    const style = {width, marginRight: 10, backgroundColor: '#f0f0f0'};
    return <Input size='small' style={style} value={value} readOnly />;
  };

  mapProps = () => {
    return {
      address: this.props.address,
      center: this.state.center,
      level: 17,
      height: 500,
      onCenterChange: (center, current) => this.setState({center, current}),
      onPosition: (center) => this.setState({center})
    };
  };

  getProps = () => {
    return {
      title: '获取经纬度',
      visible: true,
      width: 910,
      maskClosable: false,
      onOk: this.onOk,
      onCancel: this.onCancel
    };
  };

  render() {
    const {lng='', lat=''} = this.state.center || {};
    return (
      <ModalWithDrag {...this.getProps()}>
        <div style={{marginBottom: 5}}>
          <span style={{marginRight: 2}}>地址/城市</span>
          {this.toInput(this.props.address, 200)}
          <span style={{marginRight: 2}}>当前地址</span>
          {this.toInput(this.state.current, 200)}
          <span style={{marginRight: 2}}>经度</span>
          {this.toInput(lng, 90)}
          <span style={{marginRight: 2}}>纬度</span>
          {this.toInput(lat, 90)}
        </div>
        <Map {...this.mapProps()} />
      </ModalWithDrag>
    );
  }
}

export default ElectricFence;
