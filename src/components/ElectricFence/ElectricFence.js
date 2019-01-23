import React, {PropTypes} from 'react';
import {Input} from 'antd';
import Map from './Map';
import ModalWithDrag from '../ModalWithDrag';

const Search = Input.Search;

class ElectricFence extends React.Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    center: PropTypes.object,
    onClose: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {center: props.center || null, address: props.address, current: ''};
  }

  onOk = () => {
    this.props.onClose({address: this.state.address, center: this.state.center});
  };

  onCancel = () => {
    this.props.onClose();
  };

  onSearch = (value) => {
    if (value !== this.state.address) {
      this.setState({address: value, center: null, current: ''});
    } else if (this.state.current) {
      if (value !== this.state.current) {
        this.setState({center: null, current: ''});
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
      address: this.state.address,
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
      onCancel: this.onCancel,
      bodyStyle: {
        height: '450px',
        overflow: 'auto'
      }
    };
  };

  render() {
    const {lng='', lat=''} = this.state.center || {};
    const style = {marginRight: 5};
    return (
      <ModalWithDrag {...this.getProps()}>
        <div style={{marginBottom: 5}}>
          <span style={style}>详细地址</span>
          <Search {...this.searchProps(this.state.address, 200)}/>
          <span style={style}>当前地址</span>
          <Input {...this.inputProps(this.state.current, 200)}/>
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

export default ElectricFence;
