import {createFreightContainer} from '../Freight/FreightContainer';

const ACITON_PATH = 'extraCharge';  // PATH与tab页签的key值一致

const URL_FREIGHT_DETAIL = '/api/config/customerPrice/extraChargeDetail';
const URL_DELETE = '/api/config/customerPrice/extraChargeDelete';
const URL_ABLE = '/api/config/customerPrice/extraChargeAble';

const URL_ADD = '/api/config/customerPrice/extraChargeAdd';
const URL_EDIT = '/api/config/customerPrice/extraChargeEdit';
const URL_CUSTOMER = '/api/config/customerPrice/customer';
const URL_CAOMODE = '/api/config/customerPrice/carMode';
const URL_CHARGEITEM = '/api/config/customerPrice/chargeItem';
const URL_CURRENCY = '/api/config/customerPrice/currency';
const URL_BATCHEDIT = '/api/config/customerPrice/extraChargeBatchEdit';

const Container = createFreightContainer({
  PATH: ACITON_PATH,
  API: {
    list: URL_FREIGHT_DETAIL,
    delete: URL_DELETE,
    able: URL_ABLE
  },
  DIALOG_API: {
    newAdd: URL_ADD,
    editSave: URL_EDIT,
    search_customer: URL_CUSTOMER,
    search_carMode: URL_CAOMODE,
    search_chargeItem: URL_CHARGEITEM,
    search_currency: URL_CURRENCY,
    batchEdit: URL_BATCHEDIT
  },
  IMPORT_CODE: 'customer_price_master_import_detail'
});

export default Container;
