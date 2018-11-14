import React from 'react';
import ReactDOM from 'react-dom';
import {Icon} from 'antd';

const LocationControlUI = ({onClick}) => {
  return (
    <div className='map-location-control' onClick={onClick}>
      <a title='移动到当前位置'><Icon type='pld-location' spin /></a>
    </div>
  );
};

export default (BMap) => class extends BMap.Control {
  constructor(marker, {anchor, offset}) {
    super();
    this.defaultAnchor = anchor || BMAP_ANCHOR_TOP_LEFT;
    this.defaultOffset = offset || new BMap.Size(10, 10);
    this.marker = marker;
  }

  onClick = () => {
    this.map.panTo(this.marker.getPosition());
  };

  initialize = (map) => {
    const container = document.createElement("div");
    ReactDOM.render(<LocationControlUI onClick={this.onClick} />, container);
    map.getContainer().appendChild(container);
    this.map = map;
    return container;
  };
};
