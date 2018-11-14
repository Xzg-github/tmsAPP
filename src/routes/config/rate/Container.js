import createBusiness from '../../../standard-business/standard1';
import helper from '../../../common/common';

const urls = {
  URL_CONFIG: '/api/basic/rate/config',
  URL_LIST: '/api/basic/rate/list',
  URL_ACTIVE: '/api/basic/rate/active',
  URL_INVALID: '/api/basic/rate/invalid',
  URL_SAVE: '/api/basic/rate/save'
};

const STATE_PATH = ['basic', 'rate'];
const jurisdictionKey = 'rate';

const onSearch = async (key, value, {dispatch, action}) => {
  if (key === 'currencyTypeCode' || key === 'exchangeCurrencyTypeCode') {
    const {returnCode, result} = await helper.fetchJson('/api/basic/rate/currency_drop_list', helper.postOption({maxNumber: '30', currencyTypeCode: value}));
    if (returnCode === 0) {
      dispatch(action.update({options: result}, ['controls'], {key: 'key', value: key}));
    }
  }
};

const Container = createBusiness(urls, STATE_PATH, 'id', onSearch, '', jurisdictionKey);
export default Container;
