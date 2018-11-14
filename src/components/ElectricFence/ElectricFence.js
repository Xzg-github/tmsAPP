import React, {PropTypes} from 'react';
import {Input} from 'antd';
import Map from './Map';
import {getObject} from '../../common/common';
import ModalWithDrag from '../ModalWithDrag';

const MAP_PROPS = ['center', 'shape', 'cc', 'cr', 'points'];

class ElectricFence extends React.Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    center: PropTypes.object,
    shape: PropTypes.string,
    cc: PropTypes.object,
    cr: PropTypes.number,
    points: PropTypes.array,
    onClose: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = getObject(props, MAP_PROPS);
  }

  onOk = () => {
    const result = Object.assign({}, this.state, {address: this.props.address});
    this.props.onClose(result);
  };

  onCancel = () => {
    this.props.onClose();
  };

  onCenterChange = (center, hasAddress, address) => {
    if (hasAddress) {
      this.setState({center, address: address || '<--不能解析地址-->'});
    } else {
      this.setState({center});
    }
  };

  onShapeChange = (shape, cc, cr) => {
    if (shape === 'circle') {
      this.setState({shape, cc, cr});
    } else if (shape === 'polygon') {
      this.setState({shape, points: cc, cc: undefined, cr: undefined});
    } else {
      this.setState({shape, points: undefined, cc: undefined, cr: undefined});
    }
  };

  toInput = (value, width) => {
    const style = {width, marginRight: 10, backgroundColor: '#f0f0f0'};
    return <Input size='small' style={style} value={value} readOnly />;
  };

  toMap = (address) => {
    const props = {
      address,
      ...getObject(this.state, MAP_PROPS),
      height: 500,
      onCenterChange: this.onCenterChange,
      onShapeChange: this.onShapeChange
    };
    return <Map {...props} />;
  };

  getProps = () => {
    return {
      title: '电子围栏',
      visible: true,
      width: 910,
      maskClosable: false,
      onOk: this.onOk,
      onCancel: this.onCancel
    };
  };

  render() {
    const {lng='', lat=''} = this.state.center || {};
    const current = this.state.address || '';
    const address = this.props.address;
    return (
      <ModalWithDrag {...this.getProps()}>
        <div style={{marginBottom: 5}}>
          <span style={{marginRight: 2}}>地址/城市</span>
          {this.toInput(address, 200)}
          <span style={{marginRight: 2}}>当前地址</span>
          {this.toInput(current, 200)}
          <span style={{marginRight: 2}}>经度</span>
          {this.toInput(lng, 90)}
          <span style={{marginRight: 2}}>纬度</span>
          {this.toInput(lat, 90)}
        </div>
        {this.toMap(address)}
      </ModalWithDrag>
    );
  }
}

export default ElectricFence;
