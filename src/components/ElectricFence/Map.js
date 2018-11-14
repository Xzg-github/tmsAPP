import React, {PropTypes} from 'react';
import create1 from './DrawingControl';
import create2 from './LocationControl';

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

const toBmapPoint = (point) => {
  return new BMap.Point(point.lng, point.lat);
};

const toBmapPoints = (points) => {
  if (points.length > 0) {
    if (points[0] instanceof BMap.Point) {
      return points;
    } else {
      return points.map(toBmapPoint);
    }
  } else {
    return points;
  }
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

const styleOptions = {
  strokeColor:"#2196f3",  // 边线颜色。
  fillColor:"#2196f3",    // 填充颜色。当参数为空时，圆形将没有填充效果。
  strokeWeight: 2,        // 边线的宽度，以像素为单位。
  strokeOpacity: 0.8,     // 边线透明度，取值范围0 - 1。
  fillOpacity: 0.4,       // 填充的透明度，取值范围0 - 1。
  strokeStyle: 'solid'    // 边线的样式，solid或dashed。
};

class Map extends React.Component {
  static propTypes = {
    height: PropTypes.any.isRequired,
    address: PropTypes.string.isRequired,
    center: PropTypes.object,
    shape: PropTypes.string,
    cc: PropTypes.object,
    cr: PropTypes.number,
    points: PropTypes.array,
    onCenterChange: PropTypes.func,
    onShapeChange: PropTypes.func
  };

  onEnd = (overlay, drawingMode) => {
    this.overlay = overlay;
    if (drawingMode === 'circle') {
      this.props.onShapeChange('circle', overlay.getCenter(), overlay.getRadius());
    } else {
      this.props.onShapeChange('polygon', overlay.getPath());
    }
  };

  createDrawingControl = () => {
    const DrawingControl = create1(BMap, BMapLib);
    return new DrawingControl({
      anchor: BMAP_ANCHOR_TOP_LEFT,
      offset: new BMap.Size(80, 10),
      style: styleOptions,
      onStart: this.removeShape,
      onEnd: this.onEnd
    });
  };

  createLocationControl = (marker) => {
    const LocationControl = create2(BMap);
    return new LocationControl(marker, {
      anchor: BMAP_ANCHOR_BOTTOM_LEFT,
      offset: new BMap.Size(12, 60),
    });
  };

  addCenter = (map, point) => {
    this.center = point;
    this.marker = new BMap.Marker(point, {enableDragging: true});
    this.marker.addEventListener('dragend', ({point}) => {
      this.removeShape();
      this.geo.getLocation(point, (result) => {
        const address = result ? result.address : '';
        this.props.onCenterChange(point, true, address);
      });
    });
    map.addOverlay(this.marker);
    map.addControl(this.createLocationControl(this.marker));
  };

  setCenter = () => {
    if (this.overlay) {
      this.map.setViewport(this.overlay.getBounds());
    } else {
      this.map.centerAndZoom(this.center || this.props.address, 11);
    }
  };

  removeShape = () => {
    if (this.overlay) {
      this.map.removeOverlay(this.overlay);
      this.overlay = null;
      this.props.onShapeChange('none');
    }
  };

  initShape = () => {
    const {shape, cc, cr, points} = this.props;
    if (shape === 'circle') {
      this.overlay = new BMap.Circle(toBmapPoint(cc), cr, styleOptions);
      this.map.addOverlay(this.overlay);
    } else if (shape === 'polygon') {
      this.overlay = new BMap.Polygon(toBmapPoints(points), styleOptions);
      this.map.addOverlay(this.overlay);
    }
  };

  initCenter = () => {
    const {center, address, onCenterChange} = this.props;
    this.geo = new BMap.Geocoder();
    if (!center) {
      this.geo.getPoint(address, point => {
        if (point) {
          onCenterChange(point, false);
          this.addCenter(this.map, point);
          this.setCenter();
        } else {
          this.setCenter();
        }
      });
    } else {
      this.addCenter(this.map, toBmapPoint(center));
      this.setCenter();
    }
  };

  componentDidMount() {
    loadMapScript(() => {
      const map = this.map = new BMap.Map("map");
      map.enableScrollWheelZoom(true);
      map.addControl(new BMap.MapTypeControl());
      map.addControl(new BMap.NavigationControl());
      map.addControl(this.createDrawingControl());
      this.initShape();
      this.initCenter();
    });
  }

  shouldComponentUpdate(nextProps) {
    return !!nextProps.update;
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
