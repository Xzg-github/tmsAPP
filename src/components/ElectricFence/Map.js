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

// 批量获取经纬度
export const getPoints = async (items) => {
  const url1 = `http://api.map.baidu.com/getscript?v=2.0&ak=${BAIDU_AK}`;
  const url2 = 'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js';
  await createScript('BMap', url1);
  await createScript('BMapLib', url2);

  const result = [];
  for (const item of items) {
    if (!item.address || (item.longitude && item.latitude)) {
      result.push(item);
    } else {
      const point = await getPoint(item.address);
      if (point) {
        result.push(Object.assign({}, item, {longitude: point.lng, latitude: point.lat}));
      } else {
        result.push(item);
      }
    }
  }
  return result;
};

// 根据经纬度获取省、市、区
export const getDistrict = async (lat, lng) => {
  const url = `/api/proxy/district/${BAIDU_AK}/${lat}/${lng}`;
  const json = await helper.fetchJson(url);
  if (json.returnCode === 0) {
    const {province, city, district} = json.result;
    if (province && city && district) return {province, city, district};
  }
  return null;
};

// 根据多点经纬度获取始发点到目的点的里程
// 参数points = [`始发点纬度,始发点经度`,`途经点纬度,途经点经度`, ... ,`目的点纬度,目的点经度`]
export const getDistance = async (points=[]) => {
  if (points.length < 2) return;
  const ak = '018n8KOIEDfSSs7oxBhNEzCAyGlh6nXO'; //pxj的临时ak 暂用
  const json = await helper.fetchJson(`/api/proxy/distance`, helper.postOption({ak, points}));
  if (json.returnCode === 0) {
    return json.result;
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
    level: PropTypes.number,
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
      const level = this.props.level || 11;
      this.init = true;
      if (this.props.center) {
        this.map.centerAndZoom(toBmapPoint(this.props.center), level);
      } else {
        this.map.centerAndZoom('深圳市', level);
      }
    } else {
      if (this.marker) {
        this.map.panTo(this.marker.getPosition());
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
    if (this.marker) {
      this.marker = null;
      this.map.clearOverlays();
    }

    this.position().then(need => {
      if (!need) {
        this.drawMarker();
        this.setCenter();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    return (nextProps.center !== this.props.center) || (nextProps.address !== this.props.address);
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
