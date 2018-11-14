import createBusiness from '../../../standard-business/standard1';

const urls = {
  URL_CONFIG: '/api/basic/charge_item/config',
  URL_LIST: '/api/basic/charge_item/list',
  URL_ACTIVE: '/api/basic/charge_item/active',
  URL_INVALID: '/api/basic/charge_item/invalid',
  URL_SAVE: '/api/basic/charge_item/save',
  URL_SET_RULE:"/api/basic/charge_item/appointment_rule"
};

const STATE_PATH = ['basic', 'chargeItem'];
const importCode = 'charge_item';
const jurisdictionKey = 'charge_item';
const Container = createBusiness(urls, STATE_PATH, 'id', '', importCode, jurisdictionKey);
export default Container;
