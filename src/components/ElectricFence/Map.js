import React, {PropTypes} from 'react';
import helper from '../../common/common';

const BAIDU_AK = 'iX2MgjEUZUDwNWzKlEv6ScbK';

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

const getPoint = async (address) => {
  const url = `/api/proxy/${BAIDU_AK}/${address}`;
  const json = await helper.fetchJson(url);
  if (json.returnCode === 0) {
    const x = json.result.x / 100;
    const y = json.result.y / 100;
    return new BMap.MercatorProjection().pointToLngLat(new BMap.Pixel(x, y));
  } else {
    return null;
  }
};

const toBmapPoint = (point) => {
  return new BMap.Point(point.lng, point.lat);
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

class Map extends React.Component {
  static propTypes = {
    height: PropTypes.any.isRequired,
    address: PropTypes.string.isRequired,
    center: PropTypes.object,
    onCenterChange: PropTypes.func,
    onPosition: PropTypes.func
  };

  onMarkerChange = (point) => {
    this.geo.getLocation(point, (result) => {
      const address = result ? result.address : '';
      this.props.onCenterChange(point, address);
    });
  };

  drawMarker = () => {
    if (this.props.center && !this.marker) {
      this.marker = new BMap.Marker(toBmapPoint(this.props.center), {enableDragging: true});
      this.marker.addEventListener('dragend', ({point}) => this.onMarkerChange(point));
      this.map.addOverlay(this.marker);
    }
  };

  // 定位：确定address的经纬度
  position = () => {
    const {center, address, onPosition} = this.props;
    return new Promise(resolve => {
      if (center) {
        resolve(false);
      } else {
        getPoint(address).then(point => {
          if (point) {
            onPosition(point);
            resolve(true);
          } else {
            helper.showError('当前地址无法转换成经纬度');
            resolve(false);
          }
        });
      }
    });
  };

  setCenter = () => {
    if (!this.init) {
      this.init = true;
      if (this.props.center) {
        this.map.centerAndZoom(toBmapPoint(this.props.center), 11);
      } else {
        this.map.centerAndZoom('深圳市', 11);
      }
    }
  };

  componentDidMount() {
    loadMapScript(async () => {
      const map = this.map = new BMap.Map("map");
      map.enableScrollWheelZoom(true);
      map.addControl(new BMap.MapTypeControl());
      map.addControl(new BMap.NavigationControl());
      this.geo = new BMap.Geocoder();
      if (!await this.position()) {
        this.drawMarker();
        this.setCenter();
      }
    });
  }

  componentDidUpdate() {
    this.drawMarker();
    this.setCenter();
  }

  render() {
    return (
      <div style={{height: this.props.height, border: '1px solid #d9d9d9'}}>
        <div id='map' style={{height: '100%'}} />
      </div>
    );
  }
}

export default Map;
