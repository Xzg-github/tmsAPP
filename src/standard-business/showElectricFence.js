import showPopup from './showPopup';
import {ElectricFence} from '../components';

class Fence {
  constructor(addressKey='address') {
    this.addressKey = addressKey;
  }

  toFenceProps = (obj, addressEx) => {
    return {
      center: (obj.longitude && obj.latitude) ? {lng: obj.longitude, lat: obj.latitude} : undefined,
      address: addressEx || obj[this.addressKey]
    };
  };

  toServiceData = (obj) => {
    return {
      longitude: obj.center ? obj.center.lng : '',
      latitude: obj.center ? obj.center.lat : ''
    };
  };

  getEmptyData = (address) => {
    return {
      [this.addressKey]: address,
      longitude: '',
      latitude: '',
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
