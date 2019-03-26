import React from 'react';
import ModalWithDrag from '../../../components/ModalWithDrag';
import showPopup from '../../../standard-business/showPopup';
import helper from '../../../common/common';
import {DatePicker, Input, Button} from "antd";
import moment from 'moment';

const BAIDU_AK = '018n8KOIEDfSSs7oxBhNEzCAyGlh6nXO';

const getPoints = async (data) => {
  const url = `/api/track/track_transport/line_points`;
  const {returnCode, result, returnMsg} = await helper.fetchJson(url, helper.postOption(data));
  if (returnCode !== 0) {
    helper.showError(returnMsg);
    return;
  }
  return result;
};

const createScript = (id, url) => {
  return new Promise(resolve => {
    if (document.getElementById(id)) {
      resolve('ok');
    } else {
      const script = document.createElement('script');
      script.id = id;
      script.src = url;
      script.onload = () => resolve('ok');
      document.body.appendChild(script);
    }
  });
};

const loadMapScript = (onLoad) => {
  const url1 = `http://api.map.baidu.com/getscript?v=2.0&ak=${BAIDU_AK}`;
  const url2 = 'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js';
  createScript('BMap', url1).then(() => {
    return createScript('BMapLib', url2);
  }).then(() => {
    onLoad();
  });
};

class LineDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
    this.onClick = this.onClick.bind(this);
  }

  toBlueLine = () => {
    const {addressList} = this.props;
    const length = addressList.length;
    addressList.map(({latitude, longitude}, index) => {
      if (index !== length-1) {
        const polyline = new BMap.Polyline([
            new BMap.Point(longitude, latitude),
            new BMap.Point(addressList[index+1].longitude, addressList[index+1].latitude)
          ],
          {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5}
        );
        this.map.addOverlay(polyline);
      }
    });
  };

  openWindow = (info, {point}) => {
    const type = ['发货点', '收货点', '收发货点'];
    const windowOpts = {
      width : 150,     // 信息窗口宽度
      height: 50,     // 信息窗口高度
      title : type[Number(info.pickupDeliveryType || 0)]  // 信息窗口标题
    };
    const content = `${info.consigneeConsignorAddress}--${info.consigneeConsignorName}`;
    const infoWindow = new BMap.InfoWindow(content, windowOpts);  // 创建信息窗口对象
    this.map.openInfoWindow(infoWindow, point);      // 打开信息窗口
  };

  toMarkers = () => {
    const type = ['发货点', '收货点', '收发货点'];
    let pointsView = [];
    this.props.addressList.map((info) => {
      const {latitude, longitude} = info;
      const point = new BMap.Point(longitude, latitude);
      pointsView.push(point);
      const marker = new BMap.Marker(point);        // 创建标注
      marker.addEventListener("click", this.openWindow.bind(this, info));
      this.map.addOverlay(marker);                     // 将标注添加到地图中
      const opts = {
        position : point,    // 指定文本标注所在的地理位置
        offset   : new BMap.Size(-10, -40)    //设置文本偏移量
      };
      const label = new BMap.Label(type[Number(info.pickupDeliveryType || 0)], opts);  // 创建文本标注对象
      label.setStyle({
        color : "#333",
        fontSize : "12px",
        height : "20px",
        lineHeight : "20px",
        fontFamily:"微软雅黑"
      });
      this.map.addOverlay(label);
    });
    this.map.setViewport(pointsView);
  };

  componentDidMount() {
    loadMapScript(async () => {
      const map = this.map = new BMap.Map("map");
      let point = new BMap.Point(104.082684, 30.656319);
      map.centerAndZoom(point, 15);
      map.enableScrollWheelZoom(true);
      map.addControl(new BMap.MapTypeControl());
      map.addControl(new BMap.NavigationControl());
      !this.props.msg && this.toBlueLine();
      !this.props.msg && this.toMarkers();
    });
  }

  toRedLine = (arr) => {
    const length = arr.length;
    arr.map((item, index) => {
      if (index !== length-1) {
        const point = item.split(',');
        const latitude = point[0];
        const longitude = point[1];
        const point2 = arr[index+1].split(',');
        const latitude2 = point2[0];
        const longitude2 = point2[1];
        const polyline = new BMap.Polyline([
            new BMap.Point(longitude, latitude),
            new BMap.Point(longitude2, latitude2)
          ],
          {strokeColor:"green", strokeWeight:6, strokeOpacity:0.5}
        );
        this.map.addOverlay(polyline);
      }
    });
  };

  toRedLineMarkers = (arr) => {
    const point1 = arr[0].split(',');
    const latitude = point1[0];
    const longitude = point1[1];
    const point2 = arr[arr.length-1].split(',');
    const latitude2 = point2[0];
    const longitude2 = point2[1];
    let pointsView = [];
    //起点
    let point = new BMap.Point(longitude, latitude);
    pointsView.push(point);
    let marker = new BMap.Marker(point);        // 创建标注
    this.map.addOverlay(marker);                     // 将标注添加到地图中
    let opts = {
      position : point,    // 指定文本标注所在的地理位置
      offset   : new BMap.Size(-10, -40)    //设置文本偏移量
    };
    let label = new BMap.Label('起点', opts);  // 创建文本标注对象
    label.setStyle({
      color : "#333",
      fontSize : "12px",
      height : "20px",
      lineHeight : "20px",
      fontFamily:"微软雅黑"
    });
    this.map.addOverlay(label);

    //终点
    point = new BMap.Point(longitude2, latitude2);
    pointsView.push(point);
    marker = new BMap.Marker(point);        // 创建标注
    this.map.addOverlay(marker);                     // 将标注添加到地图中
    opts = {
      position : point,    // 指定文本标注所在的地理位置
      offset   : new BMap.Size(-10, -40)    //设置文本偏移量
    };
    label = new BMap.Label('终点', opts);  // 创建文本标注对象
    label.setStyle({
      color : "#333",
      fontSize : "12px",
      height : "20px",
      lineHeight : "20px",
      fontFamily:"微软雅黑"
    });
    this.map.addOverlay(label);

    this.map.setViewport(pointsView);
  };

  async onClick() {
    const url = `/api/track/track_transport/line_points`;
    const body = this.state.value;
    if (!body.startTime || !body.endTime) {
      helper.showError(`请先填写时间`);
      return;
    }
    const {returnCode, result, returnMsg} = await helper.fetchJson(url, helper.postOption(body));
    if (returnCode !== 0) return helper.showError(returnMsg);
    if (result.length < 2) return helper.showError(`暂无轨迹信息`);
    this.toRedLine(result);
    this.toRedLineMarkers(result);
  };

  toMap = () => {
    return (
      <div style={{height: 500, border: '1px solid #d9d9d9'}}>
        <div id='map' style={{height: '100%'}} />
      </div>
    );
  };

  onCancel = () => {
    this.props.onClose();
  };

  getProps = () => {
    return {
      title: '轨迹播放',
      visible: true,
      width: 910,
      maskClosable: false,
      onCancel: this.onCancel,
      footer: null
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

  onChange = (key, value, dateString) => {
    this.setState({...this.state, value:{...this.state.value, [key]: dateString}});
  };

  dateProps = (key, value, width) => {
    return {
      value: !value ? undefined : moment(value),
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      size: 'small',
      style: {width, marginRight: 10},
      onChange: this.onChange.bind(this, key)
    };
  };

  toMsg = () => {
    const {msg=''} = this.props;
    return msg ? <div style={{color: 'red'}}>{msg}</div> : null;
  };

  render() {
    const {carNumber, startTime, endTime} = this.state.value;
    const style = {marginRight: 5};
    return (
      <ModalWithDrag {...this.getProps()}>
        <div style={{marginBottom: 5}}>
          <span style={style}>车牌号</span>
          <Input {...this.inputProps(carNumber, 100)}/>
          <span style={style}>时间</span>
          <DatePicker {...this.dateProps('startTime', startTime, 200)}/>
          <span style={style}>至</span>
          <DatePicker {...this.dateProps('endTime', endTime, 200)}/>
          <Button onClick={this.onClick}>播放</Button>
        </div>
        {this.toMap()}
        {this.toMsg()}
      </ModalWithDrag>
    );
  }
}

/*
* 功能：轨迹播放对话框
* 参数：data: 【必需】待查轨迹播放的记录信息
* 返回值：空
*/
export default async (data={}) => {
  const {returnCode, result, returnMsg} = await helper.fetchJson(`/api/track/track_transport/address/${data.id}`);
  let msg = '';
  if (returnCode !== 0) {
    return helper.showError(returnMsg);
  }else if (result.length < 2) {
    msg = `收发货地址信息不完整，无法形成轨迹`;
  }
  const invalidAddressList = result.filter(item => !item.latitude || !item.longitude);
  if (invalidAddressList.length > 0) {
    msg = `以下收发货地址经纬度信息缺失，无法形成轨迹：`;
    invalidAddressList.map(item => {
      msg += `${item.consigneeConsignorName};`;
    })
  }
  const value = helper.getObject(data, ['id', 'carNumber', 'carModeId', 'gpsSimNumber', 'gpsEquipmentBrand', 'startTime', 'endTime']);
  return showPopup(LineDialog, {value, addressList: result, msg});
};
