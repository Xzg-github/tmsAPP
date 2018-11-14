import showPopup from './showPopup';
import {ElectricFence} from '../components';

class Fence {
  constructor(addressKey='address') {
    this.addressKey = addressKey;
  }

  convert = (value) => {
    return typeof value === 'string' ? JSON.parse(value) : value;
  };

  toFenceProps = (obj, addressEx = undefined) => {
    const center = (obj.longitude && obj.latitude) ? {lng: obj.longitude, lat: obj.latitude} : undefined;
    const address = addressEx || obj[this.addressKey];
    if (obj.fenceShape === 'circle') {
      return {
        center,
        address,
        shape: obj.fenceShape,
        cc: this.convert(obj.fenceCenterPoint),
        cr: Number(obj.fenceRadius)
      };
    } else if (obj.fenceShape === 'polygon') {
      return {
        center,
        address,
        shape: obj.fenceShape,
        points: this.convert(obj.fencePoints)
      };
    } else {
      return {
        center,
        address,
        shape: 'none'
      };
    }
  };

  toServiceData = (obj) => {
    const longitude = obj.center ? obj.center.lng : '';
    const latitude = obj.center ? obj.center.lat : '';
    if (obj.shape === 'circle') {
      return {
        longitude, latitude,
        fenceShape: obj.shape,
        fenceCenterPoint: obj.cc,
        fenceRadius: obj.cr,
        fencePoints: ''
      };
    } else if (obj.shape === 'polygon') {
      return {
        longitude, latitude,
        fenceShape: obj.shape,
        fencePoints: obj.points,
        fenceCenterPoint: '',
        fenceRadius: ''
      };
    } else {
      return {
        longitude, latitude,
        fenceShape: 'none',
        fenceCenterPoint: '',
        fenceRadius: '',
        fencePoints: ''
      };
    }
  };

  getEmptyData = (address) => {
    return {
      [this.addressKey]: address,
      longitude: '',
      latitude: '',
      fenceShape: 'none',
      fenceCenterPoint: '',
      fenceRadius: '',
      fencePoints: ''
    };
  };

  show = (props) => {
    return showPopup(ElectricFence, props);
  };

  async showEx(value, addressEx = undefined) {
    const result = await this.show(this.toFenceProps(value, addressEx));
    if (result) {
      return this.toServiceData(result);
    } else {
      return result;
    }
  };
}

export default Fence;
