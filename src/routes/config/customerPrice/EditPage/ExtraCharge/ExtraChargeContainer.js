import {createFreightContainer} from '../Freight/FreightContainer';

const ACITON_PATH = 'extraCharge';  // PATH与tab页签的key值一致

const URL_FREIGHT_DETAIL = '/api/config/customerPrice/freightDetail';
const URL_DELETE = '/api/config/customerPrice/freightDelete';
const URL_ABLE = '/api/config/customerPrice/freightAble';
const URL_REFRESH = '/api/config/customerPrice/freightRefresh';

const URL_ADD = '/api/config/customerPrice/freightAdd';
const URL_EDIT = '/api/config/customerPrice/freightEdit';
const URL_CUSTOMER = '/api/config/customerPrice/customer';
const URL_CAOMODE = '/api/config/customerPrice/carMode';
const URL_CHARGEITEM = '/api/config/customerPrice/changeItem';

const Container = createFreightContainer({
  PATH: ACITON_PATH,
  API: {
    list: URL_FREIGHT_DETAIL,
    delete: URL_DELETE,
    able: URL_ABLE,
    refresh: URL_REFRESH
  },
  DIALOG_API: {
    newAdd: URL_ADD,
    editSave: URL_EDIT,
    search_customer: URL_CUSTOMER,
    search_carMode: URL_CAOMODE,
    search_chargeItem: URL_CHARGEITEM
  },
  IMPORT_CODE: 'customer_price_master_import_detail'
});

export default Container;
