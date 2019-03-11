import {createFreightContainer} from '../Freight/FreightContainer';

const ACITON_PATH = 'extraCharge';  // PATH与tab页签的key值一致

const URL_FREIGHT_DETAIL = '/api/config/supplierPrice/freightDetail';
const URL_DELETE = '/api/config/supplierPrice/freightDelete';
const URL_ABLE = '/api/config/supplierPrice/freightAble';
const URL_REFRESH = '/api/config/supplierPrice/freightRefresh';

const URL_ADD = '/api/config/supplierPrice/freightAdd';
const URL_EDIT = '/api/config/supplierPrice/freightEdit';
const URL_SUPPLIER = '/api/config/supplierPrice/supplier';
const URL_CAOMODE = '/api/config/supplierPrice/carMode';
const URL_CHARGEITEM = '/api/config/supplierPrice/chargeItem';
const URL_CURRENCY = '/api/config/supplierPrice/currency';
const URL_BATCHEDIT = '/api/config/supplierPrice/freightBatchEdit';

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
    search_supplier: URL_SUPPLIER,
    search_carMode: URL_CAOMODE,
    search_chargeItem: URL_CHARGEITEM,
    search_currency: URL_CURRENCY,
    batchEdit: URL_BATCHEDIT
  },
  IMPORT_CODE: 'supplier_price_master_import_detail'
});

export default Container;
