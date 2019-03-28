import React from 'react';
import ModalWithDrag from '../../../components/ModalWithDrag';
import showPopup from '../../../standard-business/showPopup';
import helper from '../../../common/common';

const BAIDU_AK = '018n8KOIEDfSSs7oxBhNEzCAyGlh6nXO';

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

class PositionDialog extends React.Component {

  toMarkers = () => {
    let pointsView = [], msg='';
    this.props.items.map(({latitude, longitude, carNumber='未知车牌'}) => {
      if (latitude && longitude) {
        const point = new BMap.Point(longitude, latitude);
        pointsView.push(point);
        const marker = new BMap.Marker(point);        // 创建标注
        this.map.addOverlay(marker);                     // 将标注添加到地图中
        const opts = {
          position : point,    // 指定文本标注所在的地理位置
          offset   : new BMap.Size(-10, -40)    //设置文本偏移量
        };
        const label = new BMap.Label(carNumber, opts);  // 创建文本标注对象
        label.setStyle({
          color : "#333",
          fontSize : "12px",
          height : "20px",
          lineHeight : "20px",
          fontFamily:"微软雅黑"
        });
        this.map.addOverlay(label);
      }else {
        msg += `${carNumber}；`;
      }
    });
    this.map.setViewport(pointsView);
    if (msg) {
      helper.showError(`勾选记录中以下车辆无位置信息：${msg}`);
    }
  };

  componentDidMount() {
    loadMapScript(async () => {
      const map = this.map = new BMap.Map("map");
      let point = new BMap.Point(114.082684, 22.656319);
      map.centerAndZoom(point, 15);
      map.enableScrollWheelZoom(true);
      map.addControl(new BMap.MapTypeControl());
      map.addControl(new BMap.NavigationControl());
      this.toMarkers();
    });
  }

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
      title: '查看车辆位置',
      visible: true,
      width: 910,
      maskClosable: false,
      onCancel: this.onCancel,
      footer: null
    };
  };

  render() {
    return (
      <ModalWithDrag {...this.getProps()}>
        {this.toMap()}
      </ModalWithDrag>
    );
  }
}

/*
* 功能：查看位置对话框
* 参数：items: 【必需】待查看位置的记录集
* 返回值：空
*/
export default async (items) => {
  const {returnCode, result, returnMsg} = await helper.fetchJson(`/api/track/track_transport/positions`, helper.postOption(items));
  if (returnCode !== 0) {
    return helper.showError(returnMsg);
  }
  return showPopup(PositionDialog, {items: result});
};
