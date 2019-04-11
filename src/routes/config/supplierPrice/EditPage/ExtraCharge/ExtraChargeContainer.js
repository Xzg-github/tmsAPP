import {createFreightContainer} from '../Freight/FreightContainer';

const ACITON_PATH = 'extraCharge';  // PATH与tab页签的key值一致

const URL_FREIGHT_DETAIL = '/api/config/supplierPrice/extraChargeDetail';
const URL_DELETE = '/api/config/supplierPrice/extraChargeDelete';
const URL_ABLE = '/api/config/supplierPrice/extraChargeAble';

const URL_ADD = '/api/config/supplierPrice/extraChargeAdd';
const URL_EDIT = '/api/config/supplierPrice/extraChargeEdit';
const URL_SUPPLIER = '/api/config/supplierPrice/supplier';
const URL_CAOMODE = '/api/config/supplierPrice/carMode';
const URL_CHARGEITEM = '/api/config/supplierPrice/chargeItem';
const URL_CURRENCY = '/api/config/supplierPrice/currency';
const URL_BATCHEDIT = '/api/config/supplierPrice/extraChargeBatchEdit';
const URL_DISTRICT = '/api/config/customerPrice/district';
const URL_CONSIGNOR = '/api/config/customerPrice/consignor';

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
    search_supplier: URL_SUPPLIER,
    search_carMode: URL_CAOMODE,
    search_chargeItem: URL_CHARGEITEM,
    search_currency: URL_CURRENCY,
    batchEdit: URL_BATCHEDIT,
    search_district: URL_DISTRICT,
    search_consignor: URL_CONSIGNOR
  },
  IMPORT_CODE: 'supplier_price_master_import_detail'
});

export default Container;
