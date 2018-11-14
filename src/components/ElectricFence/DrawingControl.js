import React from 'react';
import ReactDOM from 'react-dom';
import {Icon} from 'antd';

const TOOLS = [
  {key: 'hand', title: '拖动', icon: 'pld-hand'},
  {key: 'circle', title: '画圆', icon: 'pld-circle'},
  {key: 'rectangle', title: '画矩形', icon: 'pld-rectangle'},
  {key: 'polygon', title: '画多边形', icon: 'pld-polygon'},
];

const DrawingControlUI = ({activeKey='hand', onClick}) => {
  return (
    <div className='map-drawing-control'>
      {TOOLS.map(({key, title, icon}) => {
        const active = activeKey === key ? true : null;
        return (
          <a key={key} data-active={active} onClick={onClick.bind(null, key)} title={title}>
            <Icon type={icon} />
          </a>
        );
      })}
    </div>
  );
};

export default (BMap, BMapLib) => class extends BMap.Control {
  constructor({anchor, offset, style, onStart, onEnd}) {
    super();
    this.defaultAnchor = anchor || BMAP_ANCHOR_TOP_LEFT;
    this.defaultOffset = offset || new BMap.Size(10, 10);
    this.style = style;
    this.onStart = onStart;
    this.onEnd = onEnd;
  }

  onClick = (key) => {
    this.draw(key);
    if (key !== 'hand') {
      this.manager.setDrawingMode(key);
      this.manager.open();
      this.onStart && this.onStart();
    } else {
      this.manager.close();
    }
  };

  onComplete = ({overlay, drawingMode}) => {
    this.draw();
    this.manager.close();
    this.onEnd && this.onEnd(overlay, drawingMode);
  };

  createManager = (map) => {
    this.manager = new BMapLib.DrawingManager(map, {
      isOpen: false,
      enableDrawingTool: false,
      circleOptions: this.style,
      polygonOptions: this.style,
      rectangleOptions: this.style
    });

    this.manager.addEventListener('overlaycomplete', this.onComplete);
  };

  draw = (activeKey) => {
    const onClick = this.onClick.bind(this);
    ReactDOM.render(<DrawingControlUI onClick={onClick} activeKey={activeKey} />, this.container);
  };

  initialize = (map) => {
    this.createManager(map);
    this.container = document.createElement("div");
    this.draw();
    map.getContainer().appendChild(this.container);
    return this.container;
  };
};
